import { cssDom, type CssObserverCallBack, type CssObserverCallBackSummary } from './cssDom.js';
import { describe, beforeEach, it, expect, vi, afterEach } from 'vitest';



describe('cssDom', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    vi.clearAllMocks();
  });

  it('should track changes for each matching element', (done) => {
    // Arrange
    const selector = '.test-selector';
    const callback: CssObserverCallBack = vi.fn();
    container.innerHTML = '<div class="test-selector"></div>';

    // Act
    const cssDomInstance = cssDom(selector);
    const tracker = cssDomInstance.each(callback);

    // Assert
    expect(tracker).toBeDefined();
    expect(tracker.start).toBeDefined();
    expect(tracker.pause).toBeDefined();
    expect(tracker.destroy).toBeDefined();

    // Wait for DOM to be ready
    cssDomInstance.onReady(() => {
      // Simulate a change
      const element = container.querySelector('.test-selector');
      element?.setAttribute('data-test', 'value');

      // Use vi.waitFor to wait for the callback to be called
      vi.waitFor(() => {
        expect(callback).toHaveBeenCalledWith(element, expect.any(MutationRecord));
        done();
      });
    });
  });

  it('should track changes and provide a summary of affected elements', (done) => {
    // Arrange
    const selector = '.test-selector';
    const callback: CssObserverCallBackSummary = vi.fn();
    container.innerHTML = '<div class="test-selector"><span></span></div>';

    // Act
    const tracker = cssDom(selector, { trackChildList: true }).summary(callback);

    // Assert
    expect(tracker).toBeDefined();
    expect(tracker.start).toBeDefined();
    expect(tracker.pause).toBeDefined();
    expect(tracker.destroy).toBeDefined();

    // Simulate a change
    setTimeout(() => {
      const element = container.querySelector('.test-selector');
      const newChild = document.createElement('p');
      element?.appendChild(newChild);

      setTimeout(() => {
        expect(callback).toHaveBeenCalledWith(expect.arrayContaining([element]));
        tracker.destroy();
        done();
      }, 50);
    }, 50);
  });

  it('should track attribute changes', (done) => {
    // Arrange
    const selector = '.test-selector';
    const callback: CssObserverCallBack = vi.fn();
    container.innerHTML = '<div class="test-selector"></div>';

    // Act
    const tracker = cssDom(selector, { trackAttributes: ['data-test'] }).each(callback);

    // Assert
    setTimeout(() => {
      const element = container.querySelector('.test-selector');
      element?.setAttribute('data-test', 'value');

      setTimeout(() => {
        expect(callback).toHaveBeenCalledWith(element, expect.any(MutationRecord));
        expect(callback).toHaveBeenCalledTimes(1);
        tracker.destroy();
        done();
      }, 50);
    }, 50);
  });

  it('should track resize events', (done) => {
    // Arrange
    const selector = '.test-selector';
    const callback: CssObserverCallBack = vi.fn();
    container.innerHTML = '<div class="test-selector" style="width: 100px; height: 100px;"></div>';

    // Act
    const tracker = cssDom(selector, { trackResize: true }).each(callback);

    // Assert
    setTimeout(() => {
      const element = container.querySelector('.test-selector') as HTMLElement;
      element.style.width = '200px';
      element.style.height = '200px';

      setTimeout(() => {
        expect(callback).toHaveBeenCalledWith(element);
        tracker.destroy();
        done();
      }, 50);
    }, 50);
  });

  it('should only track new elements when onlyNew option is true', (done) => {
    // Arrange
    const selector = '.test-selector';
    const callback: CssObserverCallBack = vi.fn();
    container.innerHTML = '<div class="test-selector"></div>';

    // Act
    const tracker = cssDom(selector, { onlyNew: true }).each(callback);

    // Assert
    setTimeout(() => {
      expect(callback).not.toHaveBeenCalled();

      const newElement = document.createElement('div');
      newElement.className = 'test-selector';
      container.appendChild(newElement);

      setTimeout(() => {
        expect(callback).toHaveBeenCalledWith(newElement);
        expect(callback).toHaveBeenCalledTimes(1);
        tracker.destroy();
        done?.();
      }, 50);
    }, 50);
  });
});