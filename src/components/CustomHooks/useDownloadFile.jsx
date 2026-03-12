
function useDownloadFile() {
  const downloadFile = async (file_id) => {
    const a = document.createElement("a");
    a.href = import.meta.env.VITE_SERVER_HOST + `/api/download/${file_id}/`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  return { downloadFile }
}

export default useDownloadFile;