import React from 'react'
import { Checkbox } from '@patternfly/react-core'
import { useObserver } from 'mobx-react'
import { Store } from '../index';

interface store {
	store: any
}



const Filter: React.FC<store> = (props: any) => {
	const dummy = (x: any) => {
		x.toggle();
		console.log("00", Store.filteredTags);
	}


	return useObserver(() => (
		<div>
			{
				props.store.map((c: any) => {
					return (
						<Checkbox
							key={c.id}
							label={c.name}
							isChecked={c.selected}
							onChange={() => dummy(c)}
							aria-label="controlled checkbox example"
							id="check-4"
							name="check4"
						/>
					)
				})
			}

		</div>
	))
}

export default Filter
