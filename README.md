# Brainova.ai - Brain Tumor Classifier

<div align="center">
  frontend/public/Brainova.ai.png

  
  [![GitHub](https://img.shields.io/badge/GitHub-oggigachad-181717?style=flat&logo=github)](https://github.com/oggigachad)
  [![LinkedIn](https://img.shields.io/badge/LinkedIn-Aakash%20Sarang-0077B5?style=flat&logo=linkedin)](https://www.linkedin.com/in/aakash-sarang-38b681263/)
  [![Kaggle Model](https://img.shields.io/badge/Kaggle-Model-20BEFF?style=flat&logo=kaggle)](https://www.kaggle.com/models/aakisarang/brainnova-ai)
  
  **Think - Smart**
  
  *An AI-powered brain tumor classification system using deep learning to analyze MRI scans and generate detailed medical reports.*
</div>

---

## 🧠 About the Project

Brainova.ai is an advanced medical imaging AI application that leverages deep learning to classify brain tumors from MRI scans. The system uses a fine-tuned ResNet18 convolutional neural network trained on thousands of brain MRI images to accurately detect and classify different types of brain tumors.

### Tumor Classifications

The model can identify **four distinct categories**:

1. **Glioma** - Tumors that arise from glial cells in the brain and spinal cord
2. **Meningioma** - Tumors that develop from the meninges (protective membranes around the brain)
3. **Pituitary Tumor** - Tumors that form in the pituitary gland
4. **No Tumor** - Healthy brain scans with no tumor detected

---

## 🎯 Key Features

- ✅ **Real-time Classification**: Upload MRI scans and receive instant AI-powered predictions
- ✅ **Batch Processing**: Analyze multiple brain scans simultaneously with aggregate statistics
- ✅ **Detailed Medical Reports**: Generate comprehensive reports with confidence scores and treatment recommendations
- ✅ **Interactive Dashboard**: Beautiful, responsive web interface with smooth animations
- ✅ **Educational Resources**: Learn about different tumor types, symptoms, and treatment options
- ✅ **GPU Acceleration**: CUDA-enabled for fast inference on compatible hardware
- ✅ **High Accuracy**: 95%+ classification accuracy on validation dataset

---

## 🏗️ Model Architecture & Training

### Model Details

- **Architecture**: ResNet18 (Residual Neural Network with 18 layers)
- **Transfer Learning**: Pre-trained on ImageNet, fine-tuned on brain tumor dataset
- **Input Size**: 224x224 RGB images
- **Output**: 4-class classification (Glioma, Meningioma, No Tumor, Pituitary)
- **Framework**: PyTorch 2.1.0

### Training Process

1. **Dataset Preparation**:
   - Collected and preprocessed thousands of brain MRI images
   - Organized into Training/ and Testing/ directories
   - Applied data augmentation (rotation, flipping, normalization)

2. **Model Training**:
   - Used transfer learning with pre-trained ResNet18
   - Modified final layer for 4-class classification
   - Added dropout (0.3) to prevent overfitting
   - Trained with Adam optimizer
   - Applied learning rate scheduling

3. **Optimization**:
   - Mixed precision training for faster computation
   - GPU acceleration (CUDA-enabled)
   - Early stopping to prevent overfitting
   - Achieved 95%+ validation accuracy

4. **Model Export**:
   - Saved best performing checkpoint as `best_model_finetuned.pth`
   - Published on Kaggle: [Brainova.ai Model](https://www.kaggle.com/models/aakisarang/brainnova-ai)

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **GSAP** - Professional-grade animation library
- **Framer Motion** - React animation library
- **Lucide React** - Beautiful icon set
- **Axios** - HTTP client for API calls
- **Recharts** - Data visualization library

### Backend
- **Flask 3.0** - Python web framework
- **PyTorch 2.1.0** - Deep learning framework
- **torchvision** - Computer vision utilities
- **Pillow (PIL)** - Image processing
- **CUDA** - GPU acceleration support
- **NumPy** - Numerical computing

### Model
- **ResNet18** - 18-layer residual network
- **Transfer Learning** - Pre-trained on ImageNet
- **Fine-tuning** - Customized for brain tumor classification
- **Mixed Precision Training** - Optimized for speed and memory

---

## 📦 Installation

### Prerequisites

- Python 3.8 or higher
- Node.js 18 or higher
- CUDA-capable GPU (optional, but recommended)

### Backend Setup

1. Clone the repository:
```bash
git clone https://github.com/oggigachad/brainnova.ai.git
cd brainnova.ai
```

2. Navigate to backend directory:
```bash
cd backend
```

3. Create a virtual environment:
```bash
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Linux/Mac)
source venv/bin/activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Download the trained model from Kaggle:
   - Visit: https://www.kaggle.com/models/aakisarang/brainnova-ai
   - Download `best_model_finetuned.pth`
   - Place it in the `backend/` directory

6. Start the backend server:
```bash
python app.py
```
The API will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```
The app will be available at `http://localhost:3000`

---

## 🚀 Usage

1. **Start Backend**: Run `python app.py` in the backend directory
2. **Start Frontend**: Run `npm run dev` in the frontend directory
3. **Open Browser**: Navigate to `http://localhost:3000`
4. **Upload MRI Scan**: Click on the batch processing tab and upload brain MRI images
5. **View Results**: See classification results with confidence scores and medical reports
6. **Explore**: Check the "Learn More" tab for educational information about brain tumors

---

## 📊 Dataset

The model was trained on a comprehensive brain tumor MRI dataset containing:
- **Training Images**: Organized by tumor type (Glioma, Meningioma, No Tumor, Pituitary)
- **Testing Images**: Separate validation set for accuracy evaluation
- **Preprocessing**: Resized to 224x224, normalized, augmented

---

## 🎨 What I Built

1. **Deep Learning Model**:
   - Fine-tuned ResNet18 architecture
   - Achieved 95%+ accuracy
   - Optimized for medical imaging

2. **Backend API**:
   - RESTful Flask application
   - Real-time prediction endpoint
   - Batch processing support
   - Template-based medical report generation

3. **Frontend Application**:
   - Modern React SPA with animations
   - File upload with drag-and-drop
   - Real-time visualization of predictions
   - Responsive design for all devices

4. **Complete Pipeline**:
   - End-to-end ML deployment
   - Model inference optimization
   - Professional UI/UX design

---

## 🔬 Technologies Used

- **Deep Learning**: PyTorch, torchvision, ResNet18
- **Computer Vision**: PIL, OpenCV (image preprocessing)
- **Web Framework**: Flask, Flask-CORS
- **Frontend**: React, Vite, Tailwind CSS
- **Animation**: GSAP, Framer Motion
- **Data Visualization**: Recharts
- **GPU Computing**: CUDA
- **Version Control**: Git, GitHub

---

## 👨‍💻 Developer

**Aakash Sarang**

Connect with me:
- 🐙 GitHub: [@oggigachad](https://github.com/oggigachad)
- 💼 LinkedIn: [Aakash Sarang](https://www.linkedin.com/in/aakash-sarang-38b681263/)
- 📊 Kaggle: [Brainova.ai Model](https://www.kaggle.com/models/aakisarang/brainnova-ai)

---

## ⚠️ Disclaimer

**Important**: This AI system is designed for **educational and research purposes only**. 

- This tool is NOT a substitute for professional medical diagnosis
- All medical decisions should be made by qualified healthcare professionals
- MRI scans should be evaluated by licensed radiologists
- This is a demonstration of AI capabilities in medical imaging
- Do not use for actual clinical diagnosis or treatment decisions

---

## 📝 License

This project is for educational purposes. Please consult with medical professionals for actual diagnosis.

---

<div align="center">
  Made with ❤️ by Aakash Sarang
  
  **Brainova.ai - Think Smart**
</div>


