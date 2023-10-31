// write a random test


const mockIndex = jest.fn(() => true);
jest.mock('../index', () => ({
    __esModule: true,
    default: mockIndex,
}));

describe('index', () => {
    it('should return true', () => {
        expect(mockIndex()).toBe(true);
    });
});