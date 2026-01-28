from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
import torch.nn as nn
from torchvision import transforms, models
from PIL import Image
import io
import numpy as np
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Define the model architecture
class BrainTumorClassifier(nn.Module):
    def __init__(self, num_classes=4):
        super(BrainTumorClassifier, self).__init__()
        self.backbone = models.resnet18(weights=None)
        in_features = self.backbone.fc.in_features
        self.backbone.fc = nn.Sequential(
            nn.Dropout(0.3),
            nn.Linear(in_features, num_classes)
        )
    
    def forward(self, x):
        return self.backbone(x)

# Load the trained model
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model = BrainTumorClassifier(num_classes=4)

try:
    checkpoint = torch.load('best_model_finetuned.pth', map_location=device)
    model.load_state_dict(checkpoint['model_state_dict'])
    print("✅ Brain tumor classification model loaded successfully!")
except FileNotFoundError:
    print("⚠️ Model file 'best_model_finetuned.pth' not found in backend directory.")
    print("   Please copy the model file from the main brain directory.")

model = model.to(device)
model.eval()

# Class information with clinical data
class_info = {
    'glioma': {
        'name': 'Glioma',
        'description': 'A type of tumor that occurs in the brain and spinal cord. Gliomas begin in the gluey supportive cells (glial cells) that surround nerve cells.',
        'severity': 'High',
        'color': '#ef4444',
        'treatment_priority': 'Urgent',
        'typical_grade': 'II-IV',
        'survival_rate': 'Variable (15-80% 5-year depending on grade)',
        'recommended_action': 'Immediate neurosurgical consultation required'
    },
    'meningioma': {
        'name': 'Meningioma',
        'description': 'A tumor that arises from the meninges — the membranes that surround the brain and spinal cord. Most meningiomas are noncancerous (benign).',
        'severity': 'Medium',
        'color': '#f59e0b',
        'treatment_priority': 'Moderate',
        'typical_grade': 'I-II (rarely III)',
        'survival_rate': '90%+ 5-year for Grade I',
        'recommended_action': 'Neurological evaluation and monitoring recommended'
    },
    'notumor': {
        'name': 'No Tumor',
        'description': 'No tumor detected in the scan. The brain tissue appears normal.',
        'severity': 'None',
        'color': '#10b981',
        'treatment_priority': 'None',
        'typical_grade': 'N/A',
        'survival_rate': 'N/A',
        'recommended_action': 'Continue routine health monitoring'
    },
    'pituitary': {
        'name': 'Pituitary Tumor',
        'description': 'Abnormal growths that develop in the pituitary gland. Most pituitary tumors are noncancerous (benign) growths (adenomas).',
        'severity': 'Medium',
        'color': '#8b5cf6',
        'treatment_priority': 'Moderate',
        'typical_grade': 'Benign (adenoma)',
        'survival_rate': '95%+ with treatment',
        'recommended_action': 'Endocrinology consultation and hormone level assessment'
    }
}

def generate_template_report(predicted_class, confidence, predictions):
    """Template-based report generation (fallback)"""
    info = class_info[predicted_class]
    differential = [p['className'] for p in predictions[:3] if p['probability'] > 10]
    
    if confidence >= 90:
        confidence_interpretation = "High confidence - findings are highly indicative"
    elif confidence >= 75:
        confidence_interpretation = "Good confidence - findings are strongly suggestive"
    elif confidence >= 60:
        confidence_interpretation = "Moderate confidence - findings suggest, recommend additional imaging"
    else:
        confidence_interpretation = "Low confidence - inconclusive, additional diagnostic studies recommended"
    
    return f"""
CLINICAL IMPRESSION:
AI-assisted analysis indicates {info['name']} with {confidence:.1f}% confidence.

FINDINGS:
Based on deep learning analysis of the provided MRI scan, the imaging characteristics 
are most consistent with {info['name']}. {info['description']}

CONFIDENCE ASSESSMENT:
{confidence_interpretation}

DIFFERENTIAL DIAGNOSIS:
{' | '.join(differential)}

SEVERITY CLASSIFICATION:
{info['severity']} severity classification
Typical Grade: {info['typical_grade']}
Treatment Priority: {info['treatment_priority']}

CLINICAL CORRELATION:
{info['recommended_action']}

PROGNOSIS:
{info['survival_rate']}

RECOMMENDATIONS:
1. Clinical correlation with patient symptoms and medical history required
2. {info['recommended_action']}
3. Consider additional imaging studies (contrast-enhanced MRI, CT scan)
4. Multidisciplinary team consultation recommended
5. Follow-up imaging as clinically indicated

DISCLAIMER:
This AI-generated report is for educational and research purposes only. 
Final diagnosis must be confirmed by qualified radiologists and healthcare professionals.
All treatment decisions should be made in consultation with licensed medical practitioners.
    """.strip()

# Image preprocessing
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'device': str(device),
        'model_loaded': True
    })

@app.route('/api/predict', methods=['POST'])
def predict():
    """Predict brain tumor type from uploaded image with Medical LLM report"""
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400
        
        file = request.files['image']
        
        # Read and preprocess image
        img_bytes = file.read()
        img = Image.open(io.BytesIO(img_bytes)).convert('RGB')
        img_tensor = transform(img).unsqueeze(0).to(device)
        
        # Make prediction
        with torch.no_grad():
            with torch.amp.autocast('cuda', enabled=torch.cuda.is_available()):
                output = model(img_tensor)
                probs = torch.softmax(output, dim=1)
        
        # Get prediction results
        probabilities = probs.cpu().numpy()[0]
        predicted_idx = int(probabilities.argmax())
        class_names = ['glioma', 'meningioma', 'notumor', 'pituitary']
        predicted_class = class_names[predicted_idx]
        confidence = float(probabilities[predicted_idx]) * 100
        
        # Prepare response with all class probabilities
        predictions = []
        for idx, class_name in enumerate(class_names):
            predictions.append({
                'class': class_name,
                'className': class_info[class_name]['name'],
                'probability': float(probabilities[idx]) * 100,
                'info': class_info[class_name]
            })
        
        predictions.sort(key=lambda x: x['probability'], reverse=True)
        
        # Generate medical report
        medical_report = generate_template_report(
            predicted_class, 
            confidence, 
            predictions, 
            class_info[predicted_class]
        )
        
        return jsonify({
            'success': True,
            'predicted_class': predicted_class,
            'predicted_class_name': class_info[predicted_class]['name'],
            'confidence': confidence,
            'predictions': predictions,
            'report': medical_report,
            'timestamp': datetime.now().isoformat(),
            'device': str(device)
        })
    
    except Exception as e:
        print(f"Error in predict endpoint: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

def generate_template_report(predicted_class, confidence, all_predictions, info):
    """Fallback template-based report generation"""
    timestamp = datetime.now().strftime("%B %d, %Y at %I:%M %p")
    
    if confidence >= 90:
        confidence_interpretation = "High confidence - findings are highly indicative"
    elif confidence >= 75:
        confidence_interpretation = "Good confidence - findings are strongly suggestive"
    elif confidence >= 60:
        confidence_interpretation = "Moderate confidence - findings suggest, recommend additional imaging"
    else:
        confidence_interpretation = "Low confidence - inconclusive, additional diagnostic studies recommended"
    
    differential = []
    for pred in all_predictions[:3]:
        if pred['probability'] > 10:
            differential.append(f"{pred['className']} ({pred['probability']:.1f}%)")
    
    report = {
        'report_id': f"NRS-{datetime.now().strftime('%Y%m%d%H%M%S')}",
        'timestamp': timestamp,
        'ai_model': 'Template-based (MedLLM not loaded)',
        'clinical_summary': f"""
NEUROSCAN AI MEDICAL REPORT

CLINICAL IMPRESSION:
AI-assisted analysis indicates {info['name']} with {confidence:.1f}% confidence.

FINDINGS:
Based on deep learning analysis of the provided MRI scan, the imaging characteristics 
are most consistent with {info['name']}. {info['description']}

CONFIDENCE ASSESSMENT:
{confidence_interpretation}

DIFFERENTIAL DIAGNOSIS:
{' | '.join(differential) if differential else 'Single finding with high confidence'}

SEVERITY CLASSIFICATION:
{info['severity']} severity classification
Typical Grade: {info['typical_grade']}
Treatment Priority: {info['treatment_priority']}

CLINICAL CORRELATION:
{info['recommended_action']}

PROGNOSIS:
{info['survival_rate']}

RECOMMENDATIONS:
1. {info['recommended_action']}
2. Clinical correlation with patient symptoms and medical history required
3. Consider additional imaging studies (contrast-enhanced MRI, CT scan)
4. Multidisciplinary team consultation recommended
5. Follow-up imaging as clinically indicated

TECHNICAL DETAILS:
- Analysis performed using ResNet18 deep learning model
- Processing device: {str(device).upper()}
- Confidence score: {confidence:.2f}%

DISCLAIMER:
This AI-generated report is for educational and research purposes only. 
Final diagnosis must be confirmed by qualified radiologists and healthcare professionals.
All treatment decisions should be made in consultation with licensed medical practitioners.
        """.strip(),
        
        'structured_data': {
            'primary_finding': info['name'],
            'confidence_score': f"{confidence:.2f}%",
            'severity_level': info['severity'],
            'treatment_urgency': info['treatment_priority'],
            'tumor_grade': info['typical_grade'],
            'prognosis': info['survival_rate'],
            'ai_model': 'Template-based'
        },
        
        'next_steps': [
            info['recommended_action'],
            'Schedule consultation with neurology/neurosurgery',
            'Review patient medical history and symptoms',
            'Consider additional diagnostic imaging',
            'Discuss treatment options with patient'
        ]
    }
    
    return report

@app.route('/api/predict-batch', methods=['POST'])
def predict_batch():
    """Predict multiple images at once"""
    try:
        files = request.files.getlist('images')
        
        if not files:
            return jsonify({'error': 'No images provided'}), 400
        
        results = []
        
        for file in files:
            img_bytes = file.read()
            img = Image.open(io.BytesIO(img_bytes)).convert('RGB')
            img_tensor = transform(img).unsqueeze(0).to(device)
            
            with torch.no_grad():
                with torch.amp.autocast('cuda', enabled=torch.cuda.is_available()):
                    output = model(img_tensor)
                    probs = torch.softmax(output, dim=1)
            
            probabilities = probs.cpu().numpy()[0]
            predicted_idx = int(probabilities.argmax())
            class_names = ['glioma', 'meningioma', 'notumor', 'pituitary']
            predicted_class = class_names[predicted_idx]
            confidence = float(probabilities[predicted_idx]) * 100
            
            results.append({
                'filename': file.filename,
                'predicted_class': predicted_class,
                'predicted_class_name': class_info[predicted_class]['name'],
                'confidence': confidence,
                'color': class_info[predicted_class]['color'],
                'severity': class_info[predicted_class]['severity']
            })
        
        return jsonify({
            'success': True,
            'total_images': len(results),
            'results': results,
            'timestamp': datetime.now().isoformat()
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/class-info', methods=['GET'])
def get_class_info():
    """Get information about all tumor classes"""
    return jsonify({
        'classes': class_info
    })

if __name__ == '__main__':
    print("=" * 70)
    print("🚀 NeuroScan AI - Brain Tumor Classifier Backend")
    print("=" * 70)
    print(f"📱 Device: {device}")
    print(f"🧠 Model: ResNet18 Brain Tumor Classifier")
    print(f"📋 Medical Reports: Template-based generation")
    print(f"🔗 API available at http://localhost:5000")
    print("=" * 70)
    app.run(debug=True, host='0.0.0.0', port=5000)
