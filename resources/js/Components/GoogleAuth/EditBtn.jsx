// EditButton.jsx
const EditButton = ({ fileId }) => {
  if (!fileId) return null;

  const handleClick = () => {
window.open(`https://docs.google.com/document/d/${fileId}/edit`, '_blank');
  };

  return <button onClick={handleClick}>Edit in Google Docs</button>;
};
export default EditButton;