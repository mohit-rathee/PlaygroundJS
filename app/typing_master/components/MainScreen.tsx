import { BlurryScreen, Scrollable } from "./Screens";
import TypingArena from "./typingComponents/TypingArena";
import ArenaProvider from "../context/ArenaContext";
import Cursor from "./typingComponents/Cursor";

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
