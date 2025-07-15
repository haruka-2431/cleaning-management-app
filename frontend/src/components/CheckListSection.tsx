import { CheckIcon } from '@heroicons/react/24/outline';

interface ChecklistSectionProps {
  section: string;
  items: string[];
  checkedItems: { [key: string]: boolean };
  selectedTemplate: string;
  onToggleCheck: (section: string, item: string) => void;
}

const ChecklistSection = ({ section, items, checkedItems, selectedTemplate, onToggleCheck }: ChecklistSectionProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="bg-gray-200 px-4 py-3 rounded-t-lg">
        <h3 className="font-medium text-gray-800">{section}</h3>
      </div>
      
      <div className="p-4 space-y-3">
        {items.map((item: string, index: number) => {
          const key = `${selectedTemplate}-${section}-${item}`;
          const isChecked = checkedItems[key] || false;
          
          return (
            <div key={index} className="flex items-start space-x-3">
              <button
                onClick={() => onToggleCheck(section, item)}
                className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                  isChecked 
                    ? 'bg-teal-600 border-teal-600 text-white' 
                    : 'border-gray-300'
                }`}
              >
                {isChecked && <CheckIcon className="w-3 h-3" />}
              </button>
              
              <label 
                className={`text-sm cursor-pointer flex-1 ${
                  isChecked ? 'text-gray-500 line-through' : 'text-gray-700'
                }`}
                onClick={() => onToggleCheck(section, item)}
              >
                {item}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChecklistSection;