export default function formatPictureStatus(status) {
    let result = 'unknown'
    switch (status) {
        case 0:
            result = 'Completed'
            break
        case 1:
            result = 'Processing'
            break
        case 2:
            result = 'Failed'
            break
    }

    return result
}