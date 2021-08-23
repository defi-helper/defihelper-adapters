let address;
export const createWavesProvider = async () => {
    if (!address) {
        const state = await window.WavesKeeper.auth({
            "data": "Auth on site"
        });
        address = state.address;
    }
    return window.WavesKeeper;
}
