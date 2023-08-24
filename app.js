document.getElementById('processButton').addEventListener('click', function () {
  const xmlFileInput = document.getElementById('xmlFile');
  const downloadButton = document.getElementById('downloadButton');
  const copyButton = document.getElementById('copyButton');

  const file = xmlFileInput.files[0];
  if (!file) {
    alert('Por favor, selecciona un archivo XML.');
    return;
  }

  const reader = new FileReader();
  reader.onload = function (event) {
    const xmlContent = event.target.result;
    const modifiedXml = processXml(xmlContent);

    enableDownloadButton(modifiedXml);
    enableCopyButton(modifiedXml);
  };
  reader.readAsText(file);

  function processXml(xmlContent) {
    const cdataPattern = /<!\[CDATA\[(.*?)]]>/gs;
    const modifiedXml = xmlContent.replace(cdataPattern, function(match, cdataContent) {
      const modifiedCData = cdataContent.replace(/<\?xml[^?]*\?>/g, '');
      return modifiedCData;
    });

    return modifiedXml;
  }

  function enableDownloadButton(xmlContent) {
    downloadButton.style.display = 'block';
    downloadButton.addEventListener('click', function () {
      const blob = new Blob([xmlContent], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'modified.xml';
      a.click();
    });
  }

  function enableCopyButton(xmlContent) {
    copyButton.style.display = 'block';
    copyButton.addEventListener('click', function () {
      const textarea = document.createElement('textarea');
      textarea.value = xmlContent;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      alert('El XML modificado se ha copiado al portapapeles.');
    });
  }
});