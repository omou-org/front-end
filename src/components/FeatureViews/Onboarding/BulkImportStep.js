import React, { useState } from 'react';
import TemplateImport from './TemplateImport';
import ImportResults from './ImportResults';

const BulkImportStep = ({ templateType }) => {
    const [activeStep, setActiveStep] = useState(0);

    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return <TemplateImport templateType={templateType} setActiveStep={setActiveStep} />

            case 1:
                return <ImportResults setActiveStep={setActiveStep} />

        }
    }



    return (
        <div>
            {getStepContent(activeStep)}


        </div>
    )
}


export default BulkImportStep;