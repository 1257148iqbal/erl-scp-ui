import React from 'react';
import ReactTOPdf from 'react-to-pdf';

const ref = React.createRef();
const Test = props => {
  return (
    <>
      <div className="background_color">
        <div className="pdf_container" ref={ref}>
          This should be your page what you want to make pdf.
        </div>
        <ReactTOPdf targetRef={ref}>
          {({ toPdf }) => (
            <button onClick={toPdf} className="get_started">
              Download
            </button>
          )}
        </ReactTOPdf>
      </div>
    </>
  );
};

export default Test;
