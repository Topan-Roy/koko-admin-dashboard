import React from 'react'
import StoryComponent from './StoryComponent'

export default function UserDetailsActivity({ userData }: { userData: any }) {
    if (!userData) return null;
    
    return (
        <div>
            <StoryComponent userId={userData?.["User ID"]} />
        </div>
    )
}
