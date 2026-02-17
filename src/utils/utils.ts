export const CLIENT_ID = 'QWVtekZIcElSMWRqQi1wN2x3LUxmTlVGSjJsTTQ0TEJ4MmVuTmZuTS01elpFVkxtNGNSODE1RWNGb3hKOTdsS3FjWEZXU25MVzQwX3o0VG0='

export const generateRandImgUrl = (width: number, height: number, seed: string): string => {
    return `https://picsum.photos/seed/${seed}/${width}/${height}`
}