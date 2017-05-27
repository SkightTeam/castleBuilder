// test array:
// const terrain = [1, 3, 2, 2, 2, 2, 6, 7, 3, '', null, 'undefined', false, 6, 1, 1, 1, 8,8, 8,8,8,8, 7, 3, 3, 3, 3, 7, 9,9];
//const terrain =  [2, 6, 6, 6, 3, 6, 1, 4];
let castles = [];

const _getCastle = (currentNumber, nextNumber, prevNumber, index, lastIndex) => {
    // Beginning of array, ignore previous number value
    if (index === 0) {
        const sample = `${currentNumber}${nextNumber}`;

        // Valley castle can be built on terrain[1]
        if (currentNumber > nextNumber) castles.push(sample);

        // Peak castle can be built on terrain[1]
        if (currentNumber < nextNumber) castles.push(sample);
    }

    // End of array, ignore nextNumber number value
    if (index === lastIndex) {
        const sample = `${prevNumber}${currentNumber}`;

        // Valley castle can be built
        if (prevNumber > currentNumber) castles.push(sample);

        // Peak castle can be built
        if (prevNumber < currentNumber) castles.push(sample);
    }

    // Middle of array use previous, current and nextNumber sample values
    if ((prevNumber || prevNumber === 0) && (nextNumber || nextNumber === 0)) {
        const sample = `${prevNumber}${currentNumber}${nextNumber}`;

        // Valley castle can be built
        if (prevNumber > currentNumber && nextNumber > currentNumber) castles.push(sample);

        // Peak castle can be built
        if (prevNumber < currentNumber && nextNumber < currentNumber) castles.push(sample);
    }
};

const _getSeriesCastles = terrain => {
    // Add all groups that are indentical number series into an array:  [2,2,2,4,4,6,6,6,6,3,3,3] etc..
    const identicalNumbersArray = terrain.reduce((accumulator, currentNumber, index, array) => {
        if (array[index + 1] === currentNumber || array[index - 1] === currentNumber) {
            accumulator.push(currentNumber);
        }
        return accumulator;
    }, []);

    // Create a map with counts of each group of identical number series
    const identicalNumbersCountmap = identicalNumbersArray.reduce((prev, cur) => {
        prev[cur] = (prev[cur] || 0) + 1;
        return prev;
    }, {});

    // Add the groups of identical numbers to the main castle container for safe keeping
    const addCastles = (count, number) => {
        const array = [];
        for (let i = 0; i < count; i += 1) {
            array.push(number);
        }
        castles.push(array.join(''));
    };

    Object.keys(identicalNumbersCountmap).forEach(number => addCastles(identicalNumbersCountmap[number], number));
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

export const filterNumbers = array => array.filter(n => (n && typeof Number(n) === 'number'));

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
