// import React from "react";

function HomePage() {
    return (
        <div>
            <h2>Home Page</h2>
            <p>This page is accessible to everyone.</p>

            <video
                style={{
                    background: "url('https://i.ytimg.com/vi/aBxerJ8xosE/maxresdefault.jpg'), url('https://i.ytimg.com/vi/aBxerJ8xosE/hqdefault.jpg')",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "0% 50%",
                    backgroundSize: "contain",
                    outline: "none"
                }}
                id="sampleMovie_html5_api"
                className="vjs-tech black-background"
                autoPlay={false}
                data-sets={{
                    language: "en",
                    autoplay: false,
                    mute: false,
                    controls: true,
                    poster: "https://i.ytimg.com/vi/aBxerJ8xosE/hqdefault.jpg",
                    fluid: true,
                    controlBar: {
                        muteToggle: false,
                        remainingTimeDisplay: true,
                        pictureInPictureToggle: false
                    },
                    LoadingSpinner: true,
                    plugins: {
                        timeOffset: {
                            start: "0",
                            end: "12435"
                        },
                        persistvolume: {
                            namespace: "safeshare-tv"
                        }
                    },
                    customControlsOnMobile: false
                }}
                playsInline
                tabIndex={-1}
                src="https://redirector.googlevideo.com/videoplayback?expire=1746302289&ei=8SAWaPzNNdqbvcAPlrTNAQ&ip=183.81.75.201&id=o-AGjwRz6Em19p2ROJHJU0BQPbjkxeEB9BgK-v-Z-wZJnP&itag=18&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ==&met=1746280689,&mh=1s&mm=31,26&mn=sn-42u-i5olk,sn-oguelnsy&ms=au,onr&mv=m&mvi=11&pl=24&rms=au,au&initcwndbps=3175000&bui=AecWEAYW0JoAzhV_n-7vmS9nU0U0MPti8Pw_82GRMqWoieWbasGf8_H4Or3pG1CR4DF2LHe9RoLdIh91&vprv=1&svpuc=1&mime=video/mp4&ns=9YYiylRcEQMBgn1kag4_uLcQ&rqh=1&gir=yes&clen=1132566582&ratebypass=yes&dur=12434.935&lmt=1745763399670968&mt=1746280179&fvip=4&lmw=1&c=TVHTML5&sefc=1&txp=5538534&n=PCIcZRWFEAmDsA&sparams=expire,ei,ip,id,itag,source,requiressl,xpc,bui,vprv,svpuc,mime,ns,rqh,gir,clen,ratebypass,dur,lmt&lsparams=met,mh,mm,mn,ms,mv,mvi,pl,rms,initcwndbps&lsig=ACuhMU0wRgIhAKv_7KtA0nTL_GUILj7G5SgkJUXbRdhXRSHP34sOPGA_AiEAsBVXlM9RJcrZpO81s9o47q_Hy5rHCMpJ-QL0YNzT0Kw=&sig=AJfQdSswRgIhALgVVupD3-GHZciuvEWo-EHADqxSuNROtfYU-l7Jb6n5AiEAqxIG6N0bJ1-YbUa9eei8bH6aPh5pqqZjFcjoEjdBf84=&fexp="
            >
                <p className="vjs-no-js">
                    To view this video please enable JavaScript, and consider upgrading
                    to a web browser that
                    <a
                        href="http://videojs.com/html5-video-support/"
                        target="_blank"
                        className="vjs-hidden"
                        hidden
                    >
                        supports HTML5 video
                    </a>
                </p>
            </video>

        </div>
    )
}

export default HomePage;