
import { markDownReaderInside } from "@lib/file/markdownReader";
import { getCgvu } from "@custom-types/core/Cgvu";

const Cgvu = () => {
    return (
        <div
            style={{
                // Forbid all interactions with user
                userSelect: "none"
            }}
            dangerouslySetInnerHTML={{
                __html: markDownReaderInside(getCgvu())
            }}
        ></div>
    );
}
export default Cgvu;
