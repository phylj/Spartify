import ButtonGroup from 'react-bootstrap/ButtonGroup'
import { useHistory } from 'react-router-dom'

/**
 * navigation component containing buttons 
 * to song, album, artist pages
 */
function Navigation() {
    const { push } = useHistory()

    //redirects to /albums endpoint passed in as prop
    const onClick = () => {
        push('/albums')
    }

    //redirects to /songs endpoint passed in as prop
    const onClickSong = () => {
        push('/songs')
    }

    //redirects to /artists endpoint passed in as prop
    const onClickArtist = () => {
        push('/artists')
    }

    return (
        <div className='center'>
            <ButtonGroup size="lg" className="btngrp">
                <button className='btn3' onClick={onClick}>Albums</button>
                <button className='btn3' onClick={onClickSong}>Songs</button>
                <button className='btn3' onClick={onClickArtist}>Artists</button>
            </ButtonGroup>
        </div>

    )
}

export default Navigation;
