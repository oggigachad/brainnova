import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, AlertCircle, Info, ChevronDown, ChevronUp, Check, Dot } from 'lucide-react';

const tumorInfo = {
  glioma: {
    name: 'Glioma',
    color: '#ef4444',
    icon: AlertCircle,
    description: 'Gliomas are tumors that originate in the glial cells of the brain and spinal cord.',
    details: [
      'Most common type of primary brain tumor',
      'Can be benign or malignant',
      'Classified into grades I-IV based on aggressiveness',
      'Grade IV (Glioblastoma) is the most aggressive'
    ],
    symptoms: [
      'Headaches',
      'Seizures',
      'Memory problems',
      'Personality changes',
      'Nausea and vomiting'
    ],
    treatment: [
      'Surgery to remove as much tumor as possible',
      'Radiation therapy',
      'Chemotherapy',
      'Targeted drug therapy',
      'Clinical trials for new treatments'
    ]
  },
  meningioma: {
    name: 'Meningioma',
    color: '#f59e0b',
    icon: Info,
    description: 'Meningiomas are tumors that arise from the meninges, the membranes surrounding the brain and spinal cord.',
    details: [
      'Most common benign brain tumor',
      'Slow-growing in most cases',
      'More common in women than men',
      'Usually occur in people over 60 years old'
    ],
    symptoms: [
      'Headaches',
      'Vision problems',
      'Hearing loss or ringing in ears',
      'Memory loss',
      'Weakness in arms or legs'
    ],
    treatment: [
      'Observation for small, asymptomatic tumors',
      'Surgery for accessible tumors',
      'Radiation therapy if surgery isn\'t possible',
      'Stereotactic radiosurgery',
      'Regular monitoring with MRI scans'
    ]
  },
  pituitary: {
    name: 'Pituitary Tumor',
    color: '#8b5cf6',
    icon: Brain,
    description: 'Pituitary tumors are abnormal growths in the pituitary gland, which controls hormone production.',
    details: [
      'Mostly benign (non-cancerous)',
      'Can affect hormone levels significantly',
      'Classified as functioning or non-functioning',
      'Relatively common, often found incidentally'
    ],
    symptoms: [
      'Hormonal imbalances',
      'Vision problems',
      'Headaches',
      'Unexplained weight changes',
      'Fatigue and weakness'
    ],
    treatment: [
      'Medication to control hormone production',
      'Transsphenoidal surgery (through the nose)',
      'Radiation therapy',
      'Hormone replacement therapy',
      'Regular endocrine monitoring'
    ]
  }
};

const TumorInfoCard = ({ type }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const info = tumorInfo[type];
  const Icon = info.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card hover:shadow-2xl transition-shadow duration-300"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="p-3 rounded-xl"
            style={{ backgroundColor: info.color + '20' }}
          >
            <Icon className="w-6 h-6" style={{ color: info.color }} />
          </div>
          <div>
            <h3 className="text-xl font-bold" style={{ color: info.color }}>
              {info.name}
            </h3>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          {isExpanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>
      </div>

      <p className="text-white/80 mb-4">{info.description}</p>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 overflow-hidden"
          >
            <div>
              <h4 className="font-semibold mb-2 text-purple-300">Key Facts</h4>
              <ul className="space-y-1">
                {info.details.map((detail, index) => (
                  <li key={index} className="text-sm text-white/70 flex items-start gap-2">
                    <Dot className="w-5 h-5 text-purple-400 flex-shrink-0" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2 text-purple-300">Common Symptoms</h4>
              <div className="flex flex-wrap gap-2">
                {info.symptoms.map((symptom, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-white/10 rounded-full text-sm"
                  >
                    {symptom}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2 text-purple-300">Treatment Options</h4>
              <ul className="space-y-1">
                {info.treatment.map((option, index) => (
                  <li key={index} className="text-sm text-white/70 flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span>{option}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <p className="text-sm text-yellow-200">
                <strong>Disclaimer:</strong> This information is for educational purposes only.
                Always consult with qualified healthcare professionals for proper diagnosis and treatment.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const EducationalInfo = () => {
  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-bold mb-2">Brain Tumor Information</h2>
        <p className="text-white/70">
          Learn about different types of brain tumors, their characteristics, and treatment options.
        </p>
      </div>

      <div className="grid gap-6">
        {Object.keys(tumorInfo).map(type => (
          <TumorInfoCard key={type} type={type} />
        ))}
      </div>

      <div className="card bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-indigo-400/30">
        <h3 className="text-xl font-semibold mb-3">About Our AI Model</h3>
        <div className="space-y-3 text-white/80">
          <p>
            Our brain tumor classification system uses advanced deep learning technology based on
            ResNet18 architecture, trained on thousands of MRI scans.
          </p>
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div className="p-3 bg-white/5 rounded-lg">
              <p className="text-2xl font-bold text-purple-400">95%+</p>
              <p className="text-sm text-white/70">Accuracy Rate</p>
            </div>
            <div className="p-3 bg-white/5 rounded-lg">
              <p className="text-2xl font-bold text-purple-400">4</p>
              <p className="text-sm text-white/70">Tumor Classes</p>
            </div>
            <div className="p-3 bg-white/5 rounded-lg">
              <p className="text-2xl font-bold text-purple-400">GPU</p>
              <p className="text-sm text-white/70">Accelerated</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationalInfo;
