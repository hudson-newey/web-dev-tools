export class LayoutShiftObserver {
  private static _instance: LayoutShiftObserver;
  private static performanceObserver: PerformanceObserver;

  public static get instance(): LayoutShiftObserver {
    LayoutShiftObserver._instance ??= new LayoutShiftObserver();
    return LayoutShiftObserver._instance;
  }

  private _shiftedElementCount = 0;

  public get shiftedElementCount(): number {
    return this._shiftedElementCount;
  }

  public observe(): void {
    if (LayoutShiftObserver.performanceObserver) {
      return;
    }

    LayoutShiftObserver.performanceObserver = new PerformanceObserver(
      (list) => {
        for (const entry of list.getEntries() as any) {
          if (!entry.hadRecentInput) {
            if (entry.sources) {
              for (const { node } of entry.sources) {
                this._shiftedElementCount++;
              }
            }
          }
        }
      }
    );

    LayoutShiftObserver.performanceObserver.observe({
      type: "layout-shift",
      buffered: true,
    });
  }
}
