import LoginButton from './LoginButton'
import { useHistory } from 'react-router-dom'

/**
 * The default page that directs to login
 */
const LandingBody = () => {

    const { push } = useHistory()

    /**
     * onClick function that redirects to the login endpoint
     * passed in as a prop to Login Button component 
    **/
    const onClick = () => {
        push('/login')
    }


    return (
        <div>
            <h1 className="lrgtxt">
                Personalized art based on<br />YOUR music taste
            </h1>
            <h2 className="medtxt">
                Generate art based on top albums, tracks, artists
            </h2>
            <LoginButton onClick={onClick} />
        </div>
    )
}

export default LandingBody