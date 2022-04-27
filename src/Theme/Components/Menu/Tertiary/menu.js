import React, { useState, useEffect } from 'react'
import './menu.css'


// representation of the menuData
// const tempMenuData = [
//     {
//         title: "Title one",
//         returnOnSelect: {
//           position: 0,
//         }
//     },
//     {
//         title: "Title two",
//         returnOnSelect: {
//           position: 1,
//         }
//     },
// ]

export default function Menu({ menuData, returnOnSelect, state }) {
    const [selected, setSelected] = useState(0)

    useEffect(() => {
        setSelected(state)
    }, [state])

    return (
        <div className="tertiary-menu">
            <div className="menu-scroll-container">
                <div className="menu-items">
                    <ul>
                        {menuData.map((element) => {
                            return (
                                <li
                                    key={element["returnOnSelect"]["position"]}
                                    className={selected === element["returnOnSelect"]["position"] ? "menu-item selected" : "menu-item"}
                                    onClick={() => {
                                        setSelected(element["returnOnSelect"]["position"])
                                        returnOnSelect(element["returnOnSelect"])
                                    }}
                                >
                                    {element["title"].length > 13 ? element["title"].slice(0, 13) + " ..." : element["title"]}
                                </li>
                            )
                        })}

                    </ul>
                </div>
            </div>
        </div>
    )
}
// import React, { useState } from 'react'
// import './menu.css'


// // representation of the menuData
// // const tempMenuData = [
// //     {
// //         title: "Title one",
// //         position: 0,
// //         returnOnSelect: "first drug"
// //     },
// //     {
// //         title: "Title two",
// //         position: 1,
// //         returnOnSelect: "second drug"
// //     },
// // ]

// export default function Menu({ menuData, returnOnSelect, state, selectedElementTitle }) {
//     const [selected, setSelected] = useState(state || 0)
//     const [elementTitle, setElementTitle] = useState(selectedElementTitle)

//     useEffect(() => {
//     }, [selected, elementTitle])

//     return (
//         <div className="tertiary-menu">
//             <div className="menu-scroll-container">
//                 <div className="menu-items">
//                     <ul>
//                         {menuData.map((element) => {
//                             return (
//                                 selected === element["returnOnSelect"]["position"] ?
//                                     <li
//                                         key={element["returnOnSelect"]["position"]}
//                                         className={"menu-item selected"}
//                                         onClick={() => {
//                                             setSelected(element["returnOnSelect"]["position"])
//                                             returnOnSelect(element["returnOnSelect"])
//                                         }}

//                                     >
//                                         {elementTitle}
//                                     </li> :
//                                     <li
//                                         key={element["returnOnSelect"]["position"]}
//                                         className={"menu-item selected"}
//                                         onClick={() => {
//                                             setSelected(element["returnOnSelect"]["position"])
//                                             returnOnSelect(element["returnOnSelect"])
//                                         }}

//                                     >
//                                         {element["title"].length > 13 ? element["title"].slice(0, 13) + " ..." : element["title"]}
//                                     </li>
//                             )
//                         })}

//                     </ul>
//                 </div>
//             </div>
//         </div>
//     )
// }
