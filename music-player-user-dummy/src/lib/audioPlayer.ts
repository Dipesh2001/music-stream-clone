class AudioPlayer {
    private audio: HTMLAudioElement;

    constructor() {
        this.audio = new Audio();
        this.audio.autoplay = true;
    }

    public getElement() {
        return this.audio;
    }

    public load(src: string) {
        if (this.audio.src !== src) {
            this.audio.src = src;
            this.audio.load();
        }
    }

    public play() {
        return this.audio.play();
    }

    public pause() {
        this.audio.pause();
    }

    public seek(time: number) {
        this.audio.currentTime = time;
    }

    public setVolume(value: number) {
        this.audio.volume = value;
    }

    public destroy() {
        this.audio.pause();
        this.audio.src = '';
    }
}

export const audioPlayer = new AudioPlayer();
