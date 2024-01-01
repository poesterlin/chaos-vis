export async function readWavData(): Promise<AudioBuffer> {
    // const blob = new Blob([file], { type: 'audio/wav' });
    // const fileReader = new FileReader();
    // const arrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
    //     fileReader.onload = () => resolve(fileReader.result as ArrayBuffer);
    //     fileReader.onerror = () => reject(fileReader.error);
    //     fileReader.readAsArrayBuffer(blob);
    // });
    // debugger

    const response = await fetch("/example.wav");
    const arrayBuffer = await response.arrayBuffer();

    const context = new AudioContext();
    const audioBuffer = await context.decodeAudioData(arrayBuffer);
    return audioBuffer;
}