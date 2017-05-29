// test array:
// const terrain = [1, 1, 2, 2, 2, 2, 6, 7, 3, '', null, 'undefined', false, 6, 8,8, 8,8,8,8, 7, 3, 3, 3, 3, 7, 9,9];

let castles = [];

const _getCastle = (currentNumber, nextNumber, prevNumber, index, lastIndex) => {
    // Beginning of array, ignore previous number value
    if (index === 0) {
        const sample = `(${currentNumber}${nextNumber})`;

        // Valley castle can be built on terrain[1]
        if (currentNumber > nextNumber) castles.push(sample);

        // Peak castle can be built on terrain[1]
        if (currentNumber < nextNumber) castles.push(sample);
      
    }

    // End of array, ignore nextNumber number value
    if (index === lastIndex) {
        const sample = `(${prevNumber}${currentNumber})`;

        // Valley castle can be built
        if (prevNumber > currentNumber) castles.push(sample);

        // Peak castle can be built
        if (prevNumber < currentNumber) castles.push(sample);
    }

    // Middle of array use previous, current and nextNumber sample values
    if ((prevNumber || prevNumber === 0) && (nextNumber || nextNumber === 0)) {
        const sample = `(${prevNumber}${currentNumber}${nextNumber})`;

        // Valley castle can be built
        if (prevNumber > currentNumber && nextNumber > currentNumber) castles.push(sample);

        // Peak castle can be built
        if (prevNumber < currentNumber && nextNumber < currentNumber) castles.push(sample);
    }
};

const _getSeriesCastles = terrain => {

    /*
     * Create an array of objects containing all the info we need to check
     * if a series of identical numbers is a peak or valley
     *
     * For example: we have the following in our terrain array [2,4,4,4,1,6,6,6,6,2]
     * An array containing these objects will be returned:
     * [
     *  4: {count: 3,indexSpan: [1,2,3]},
     *  6: {count: 4, indexSpan: [5,6,7,8]}
     * ]
     *
     * FIXME: Duplicate series groups at non consecutive indexes get merged!
     *
     */
    const numberIndexMap = terrain
        .reduce((numberIndexMap, currentNumber, index, array) => {
            if (array[index + 1] === currentNumber || array[index - 1] === currentNumber) {
                numberIndexMap.push({ number: currentNumber, index });
            }
            return numberIndexMap;
        }, [])
        .reduce((prev, { number, index }) => {
            prev[number] = prev[number] || {};
            prev[number].indexSpan = prev[number].indexSpan || [];
            prev[number].count = prev[number].count || 0;
            prev[number].count = prev[number].count + 1;
            prev[number].indexSpan.push(index);
            return prev;
        }, {});

    // Add the groups of identical numbers to the main castle container for safe keeping
    const addCastles = ({ count, indexSpan }, number) => {
        console.log('count, indexSpan, number', count, indexSpan, number);

        const array = [];
        const precedingInt = terrain[indexSpan[0] - 1];
        const followingInt = terrain[indexSpan[indexSpan.length - 1] + 1];
        const terrainArrayStart = terrain[0];
        const terrainArrayEnd = terrain[terrain.length - 1];

        // Check preceeding and following number of identical series groups to determine peak/valley
        if ((precedingInt > number && followingInt > number) || (precedingInt < number && followingInt < number)) {
            for (let i = 0; i < count; i += 1) {
                array.push(number);
            }
        }

        // Handle special case for series groups at start of array
        if (!precedingInt && terrainArrayStart && (followingInt > number || followingInt < number)) {
            for (let i = 0; i < count; i += 1) {
                array.push(number);
            }
        }

        // Handle special case for series groups at end of array
        if (!followingInt && terrainArrayEnd && (precedingInt > number || precedingInt < number)) {
            for (let i = 0; i < count; i += 1) {
                array.push(number);
            }
        }

        if (array.length) castles.push(`(${array.join('')})`);
    };

    Object.keys(numberIndexMap).forEach(number => addCastles(numberIndexMap[number], number));
};

const _getNonSeriesCastles = array => {
    array.forEach((currentNumber, index, arr) => {
        const nextNumber = arr[index + 1];
        const prevNumber = arr[index - 1];
        const lastIndex = arr.length - 1;

        // Get buildable castles
        _getCastle(currentNumber, nextNumber, prevNumber, index, lastIndex);
    });
};

export const filterNumbers = array => array.filter(n => n && typeof Number(n) === 'number');

// Main function
export const buildCastles = terrain => {
    castles = [];

    // Remove non number items
    terrain = filterNumbers(terrain);

    // Get castles that are made up of multiple identical numbers
    _getSeriesCastles(terrain);

    // Get castles that are made up on non identical series numbers
    _getNonSeriesCastles(terrain);

    return castles;
};
