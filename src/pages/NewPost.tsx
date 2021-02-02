import Tinymce from "../components/editors/Tinymce";
import Wysiwyg from "../components/editors/Wysiwyg";

function NewPost() {
  return (
    <div>
      <h2>Wysiwyg</h2>
      <div>
        <Wysiwyg />
      </div>
      <br />
      <h2>Tinymce</h2>
      <Tinymce />
    </div>
  );
}

export default NewPost;
