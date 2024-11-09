import Scrollable from "./Scrollable";
import BlurryScreen from "./BlurryScreen";
import TypingArena from "./TypingArena";
import ArenaProvider from "../context/ArenaContext";
import Cursor from "./Cursor";

export default function MainPallet() {
    return (
        <ArenaProvider>
            <BlurryScreen>
                <Scrollable>
                    <TypingArena />
                    <Cursor />
                </Scrollable>
            </BlurryScreen>
        </ArenaProvider>
    )
}
