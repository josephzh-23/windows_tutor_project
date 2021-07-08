  
import React, { useState } from 'react'

// How to use useState with array
function HookCounterFour() {

	// We should use this one not the one below 

	// Try to use friendRequestIds, not items 
	
	 const [friendRequestIds, setFriendRequestIds] = useState()
	const [items, setItems] = useState([])


	useEffect(() => {

		// If friendRequestIds are arrays here 
		setFriendRequestIds(res.data.friendRequestIds)
		return () => {
			cleanup
		}
	}, [input])

	// Also have to use the spread operator
	const addItem = () => {
		setItems([
			...items,
			{
				id: items.length,
				value: Math.floor(Math.random() * 10) + 1
			}
		])
	}

	return (
		<div>
			<button onClick={addItem}>Add a number</button>
			<ul>
				{items.map(item => (
					<li key={item.id}>{item.value}</li>
				))}
			</ul>
		</div>
	)
}

export default HookCounterFour