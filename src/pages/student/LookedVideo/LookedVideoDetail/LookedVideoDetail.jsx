import React, { Component } from 'react'
import { Player } from 'video-react';
import '../../../../../node_modules/video-react/dist/video-react.css'

export default class LookedVideoDetail extends Component {
    state = {
        videoPath: '',
    }
    render() {
        const { vpath } = this.props.location.state
        return (
            <div>
                <div style={{ width: 800, height: 700, margin: 50 }}>
                    <Player
                        playsInline
                    // poster="/assets/poster.png"
                    >
                        <source src={`http://localhost:8080/video/${vpath}`} />
                    </Player>
                </div>
            </div>
        )

    }
}
