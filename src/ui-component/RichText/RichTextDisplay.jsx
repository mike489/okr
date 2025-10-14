import { Box } from '@mui/material';
import PropTypes from 'prop-types';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const RichTextDisplay = ({ content }) => {
  if (!content) return null;

  return (
    <Box
      sx={{
        mt: 2,
        '& .ql-editor': {
          padding: 1,
          fontSize: '0.875rem',
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          lineHeight: 1.5,
        },
        '& .ql-editor p': {
          marginBottom: '0.5rem',
        },
        '& .ql-editor ul, .ql-editor ol': {
          paddingLeft: '1.5rem',
          marginBottom: '0.5rem',
        },
        '& .ql-editor li': {
          marginBottom: '0.25rem',
        },
        '& .ql-editor h1, .ql-editor h2, .ql-editor h3': {
          marginTop: '1rem',
          marginBottom: '0.5rem',
        },
      }}
    >
      <ReactQuill
        value={content}
        readOnly={true}
        theme={'bubble'}
        modules={{ toolbar: false }}
      />
    </Box>
  );
};

RichTextDisplay.propTypes = {
  content: PropTypes.string,
};

export default RichTextDisplay;
