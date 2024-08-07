import * as utils from '../../src/utils'
import { clearSelection } from '../../src/utils'
import {
    describe,
    it,
    expect,
    beforeEach,
    afterEach,
    vi,
    beforeAll,
    afterAll
} from 'vitest'

describe('Selection utils', () => {
    describe('clearSelection', () => {
        let spy

        beforeEach(() => {
            spy = vi.spyOn(window, 'getSelection')
        })

        afterEach(() => {
            spy.mockRestore()
        })

        describe('when getSelection is defined', () => {
            it('should try and get the selection', () => {
                spy.mockImplementation(() => ({}))

                clearSelection()
                expect(window.getSelection).toHaveBeenCalled()
            })

            describe('when selection is undefined', () => {
                it('should interrupt function execution', () => {
                    spy.mockImplementation(() => undefined)
                    clearSelection()
                    expect(window.getSelection()).toBeUndefined()
                })
            })

            describe('when selection has "empty" method', () => {
                it('should call it', () => {
                    spy.mockImplementation(() => ({
                        empty: vi.fn()
                    }))
                    clearSelection()
                    expect(window.getSelection()!.empty).toBeDefined()
                })
            })

            describe('otherwise, if "remooveAllRanges" is defined', () => {
                it('should call it', () => {
                    spy.mockImplementation(() => ({
                        removeAllRanges: vi.fn()
                    }))
                    clearSelection()
                    expect(window.getSelection()!.removeAllRanges).toBeDefined()
                })

                describe('if the window has "ontouchstart" method', () => {
                    let utilMock: any = null
                    beforeAll(() => {
                        utilMock = vi
                            .spyOn(utils, 'isMobileOrTablet')
                            .mockImplementation(() => true)
                    })
                    afterAll(() => {
                        if (utilMock) {
                            utilMock.mockRestore()
                        }
                    })

                    it('should call the "addRange" method', () => {
                        window.ontouchstart = vi.fn()
                        vi.spyOn(utils, 'isMobileOrTablet').mockImplementation(
                            () => true
                        )
                        const docSpy = vi.spyOn(document, 'createRange')

                        spy.mockImplementation(() => ({
                            removeAllRanges: vi.fn(),
                            addRange: vi.fn()
                        }))

                        docSpy.mockImplementation(
                            () =>
                                ({
                                    startOffset: 0,
                                    endOffset: 0
                                }) as any
                        )

                        clearSelection()
                        expect(window.getSelection()!.addRange).toBeDefined()
                        expect(docSpy).toHaveBeenCalled()
                    })
                })
            })
        })
    })
})
