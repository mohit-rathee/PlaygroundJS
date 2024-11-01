import { PageContext } from "../context/PageContext";
import { useContext } from "react";
import Scrollable from "./Scrollable";
import BlurryScreen from "./BlurryScreen";
import TypingArena from "./TypingArena";
import ArenaProvider from "../context/ArenaContext";
import Cursor from "./Cursor";

export default function MainPallet() {
    const { typingContent, isFocused, } = useContext(PageContext);
    const wordList: string[] = typingContent

    return (
        <ArenaProvider>
            <div className={`relative h-60 w-[80%] rounded-xl `}>
                {!isFocused && <BlurryScreen />}
                <Scrollable>
                    <Cursor />{/* Cursor will follow <ActiveWord>  */}
                    <TypingArena wordList={wordList} />
                </Scrollable>
            </div>
        </ArenaProvider>
    )
}
