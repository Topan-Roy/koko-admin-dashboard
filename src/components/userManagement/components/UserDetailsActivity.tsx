import React from 'react'
import { useParams } from 'react-router-dom'
import StoryComponent from './StoryComponent'

export default function UserDetailsActivity({ userData }: { userData: any }) {
    const { id } = useParams();
    
    return (
        <div>
            <StoryComponent userId={id} />
        </div>
    )
}
