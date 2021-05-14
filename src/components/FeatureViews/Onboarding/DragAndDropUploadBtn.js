import React, { useMemo,  useContext } from 'react';
import { useDropzone } from 'react-dropzone';
import { omouBlue } from '../../../theme/muiTheme';
import { useUploadOmouTemplate } from '../../../utils';
import { OnboardingContext } from './OnboardingContext';
import PropTypes from 'prop-types';

const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '30px 10px ',
    width: '200px',
    height: '144px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#289FC3',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: `${omouBlue}`,
    outline: 'none',
    transition: 'border .24s ease-in-out'
};

const activeStyle = {
    borderColor: '#2196f3'
};

const acceptStyle = {
    borderColor: '#00e676'
};

const rejectStyle = {
    borderColor: '#ff1744'
};
const DragAndDropUploadBtn = ({templateType, setUploadResponse, uploadResponse}) => {
    const { uploadTemplate } = useUploadOmouTemplate();
    
    const { dispatch } = useContext(OnboardingContext);
    const uploadFile = async (file) => {
    
    
    let response = await uploadTemplate(file, templateType);


    dispatch({ type: 'UPLOAD_RESPONSE', payload: response });

            if (Object.prototype.hasOwnProperty.call(response, 'errors')) {
                setUploadResponse(response.errors[0].message);
            } else {
                setUploadResponse(file.name);
            }
        };
    
    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject
    } = useDropzone({
        accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        maxFiles: 1,
        onDrop: file => uploadFile(file[0]),
        
    });




    const style = useMemo(() => ({
        ...baseStyle,
        ...(isDragActive ? activeStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [
        isDragActive,
        isDragReject,
        isDragAccept
    ]);



    return (
        <section className="container">
            <div {...getRootProps({ style })}>
                <input  {...getInputProps()} />
                {uploadResponse === null ?
                    <p>Drag and drop some files here, or click to select files</p> :
                    uploadResponse}
            </div>

        </section>
    );
    };

DragAndDropUploadBtn.propTypes = {
    templateType: PropTypes.string,
    setUploadResponse : PropTypes.func,
    uploadResponse : PropTypes.func
};

export default DragAndDropUploadBtn;
