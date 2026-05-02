import { useParams } from 'react-router-dom'
import StoryComponent from './StoryComponent'

export default function UserDetailsActivity() {
    const { id } = useParams();
    
    return (
        <div>
            <StoryComponent userId={id} />
        </div>
    )
}
