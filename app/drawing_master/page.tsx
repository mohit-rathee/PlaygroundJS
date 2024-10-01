"use client"
import '../globals.css';
import HomeTemplate from '../components/layout/HomeTemplate';
import DrawingBoard from './components/drawingBoard';
export default function Home() {
    return (
        <HomeTemplate
            title="Drawing Master"
            childComponent={<DrawingBoard />}
        />
    );
}

// TODO:
// 1. Use helper canvas to do color mapping to select drawings:
//      * generate unique id's for each drawing, derive color from it 
//          and draw on helper canvas.
//      * it should also be layerd just like the main canvas.
//      * when selecting on a point we will search for some color from
//          top helper layer to bottom at that location untill we find
//          some, then map the id from our array and draw gizmo.
// 2. Use different types to create different shapes:
//      * shape's types could be sqare,circle...etc.
//      * emoji type could be 😀,😂...etc.
//      * image type could be an image.
// 3. Create an action table and perform undo/redo on that basis:
//      * actions could be 
//          # adding a stroke
//          # deleting a stroke
//          # changing its properties(color,border...etc)
//          # moving from location A to location B
//          # resizing and rotating
// 5. Top layer would only contain current drawing or selected drawing:
//      * then we would transfer from top layer to required layer
//      * same operations would be done with helper canvas
// 6. Use a single array to store whole drawing
//      * we can use an array with each element containing a layerIndex.
//      * as undo/redo operations would be performed from action table.
//      * and by this way we can send drawing from bottom layer to 
//      * top layer without needing to do lot of array operations

