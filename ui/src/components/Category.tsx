import React from 'react'
import { useObserver } from "mobx-react";
import Filter from './Filter';

interface store {
	store: any
}

const Category: React.FC<store> = (props: any) => {
	// console.log("00", Store.filteredTags);

	// console.log(props.store.filteredTags)
	return useObserver(() => (
		<div style={{ margin: '5em' }}>
			<h2> No of categories :{props.store.count}</h2>

			<button onClick={props.store.clearAll}>
				Clear All
			</button>

			<Filter store={props.store.categories} />

			{
				console.log(props.store.categories)
			}

		</div>
	))

}

export default Category


