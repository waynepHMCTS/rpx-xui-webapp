import { ConnectionPositionPair } from '@angular/cdk/overlay';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ToolbarButtonVisibilityService, ToolbarEventService } from '@hmcts/media-viewer';
import { Subscription } from 'rxjs';

export interface ButtonState {
  id: string;
  showOnToolbar: boolean;
}

@Component({
    selector: 'exui-media-viewer-toolbar',
    templateUrl: './media-viewer-toolbar.component.html',
    styleUrls: ['./media-viewer-toolbar.component.scss']
})

export class MediaViewerToolbarComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('zoomSelect') public zoomSelect: ElementRef;
  // @ViewChild('dropdownMenu') public dropdownMenu: ElementRef; // Could we add and remove child nodes to the dropdown this way?
  @ViewChild('mvToolbarMain') public mvToolbarMain: ElementRef<HTMLElement>;

  public pageNumber = 1;
  private readonly subscriptions: Subscription[] = [];
  public isDropdownMenuOpen = false;
  public dropdownMenuPositions = [
    new ConnectionPositionPair(
      {
        originX: 'end',
        originY: 'bottom'
      },
      {
        overlayX: 'end',
        overlayY: 'top'
      },
      0,
      3)
  ];
  public hiddenDropdownMenu: Element[] = [];
  public hideDropdownMenuButton = true;
  private readonly breakWidths: number[] = [];
  private readonly toolbarButtonVisibilityStates: ButtonState[] = [];

  // Reference to the main toolbar element
  // private mvToolbarMain: HTMLElement;

  public constructor(
    public readonly toolbarEvents: ToolbarEventService,
    public readonly toolbarButtons: ToolbarButtonVisibilityService,
    private readonly cdr: ChangeDetectorRef
  ) {
  }

  public ngOnInit() {
    this.subscriptions.push(
      this.toolbarEvents.setCurrentPageSubject.subscribe(pageNumber => this.setCurrentPage(pageNumber)),
      this.toolbarEvents.setCurrentPageInputValueSubject.subscribe(pageNumber => this.pageNumber = pageNumber)
    );
  }

  public ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  public ngAfterViewInit() {
    let totalSpace = 0;

    // Loop over all elements and set sum of widths for each toolbar element
    for (const element of Array.prototype.slice.call(this.mvToolbarMain.nativeElement.children)) {
      totalSpace += element.clientWidth;
      this.breakWidths.push(totalSpace);

      // Set a flag for this element's visibility and push to array of button states
      this.toolbarButtonVisibilityStates.push({ id: element.id, showOnToolbar: true } as ButtonState);
    }

    // Call calculation method
    this.checkCalculation();
  }

  @HostListener('window:resize', ['$event'])
  public onResize(event: Event) {
    // Call calculation method
    this.checkCalculation();
  }

  private checkCalculation() {
    // Get current space of main toolbar element
    const availableSpace = this.mvToolbarMain.nativeElement.offsetWidth;

    // Get space required for all elements in main toolbar element (i.e. break-width of the last visible element from breakWidth array)
    const indexOfLastVisibleElement = Array.from(this.mvToolbarMain.nativeElement.children).length - 1;
    const totalSpaceRequired = this.breakWidths[indexOfLastVisibleElement];

    // If more space is needed than is available, hide last element
    if (totalSpaceRequired > availableSpace) {
      // Remove the last element from the main toolbar...
      const lastToolbarElement = this.mvToolbarMain.nativeElement.removeChild(this.mvToolbarMain.nativeElement.lastElementChild);

      // ...and add it to the start of hiddenDropdownMenu
      // this.dropdownMenu.nativeElement.appendChild(this.mvToolbarMain.lastElementChild);
      this.hiddenDropdownMenu.unshift(lastToolbarElement);

      // Show the button for the dropdown menu
      this.hideDropdownMenuButton = false;

      // Apply changes
      this.cdr.detectChanges();

      // Call this method to recalculate for rest of toolbar elements
      this.checkCalculation();
    } else {
      // If there are elements in hidden dropdown menu
      if (this.hiddenDropdownMenu.length > 0) {
        // Remove the first element from hiddenDropdownMenu...
        const firstHiddenElement = this.hiddenDropdownMenu.shift();

        // ...and add it to the main toolbar
        this.mvToolbarMain.nativeElement.appendChild(firstHiddenElement);

        // Hide or show the button for the dropdown menu if there no elements or some remaining respectively
        this.hideDropdownMenuButton = !(this.hiddenDropdownMenu.length > 0);
      }

      // Apply changes
      this.cdr.detectChanges();
    }
  }

  public isToolbarButtonVisible(buttonId: string): boolean {
    for (const buttonState of this.toolbarButtonVisibilityStates) {
      if (buttonState.id === buttonId) {
        return buttonState.showOnToolbar;
      }
    }
  }

  public setToolbarButtonVisible(buttonId: string, visible: boolean) {
    for (const buttonState of this.toolbarButtonVisibilityStates) {
      if (buttonState.id === buttonId) {
        buttonState.showOnToolbar = visible;
      }
    }
  }

  // Handler onClick Event of the Highlight Mode Button
  public onClickHighlightToggle() {
    // Emit an event that HighlightMode has been enabled/disabled
    this.toolbarEvents.toggleHighlightMode();
  }
  // Handler onClick Event of the Draw Mode Button
  public onClickDrawToggle() {
    // Emit an event that HighlightMode has been enabled/disabled
    this.toolbarEvents.toggleDrawMode();
  }

  public toggleSideBar() {
    this.toolbarButtons.showSidebar = !this.toolbarButtons.showSidebar;
  }

  public toggleSearchBar() {
    this.toolbarButtons.showSearchBar = !this.toolbarButtons.showSearchBar;
  }

  public increasePageNumber() {
    this.toolbarEvents.changePageByDeltaSubject.next(1);
  }

  public decreasePageNumber() {
    this.toolbarEvents.changePageByDeltaSubject.next(-1);
  }

  public onPageNumberInputChange(pageNumber: string) {
    this.toolbarEvents.setCurrentPageSubject.next(Number.parseInt(pageNumber, 0));
  }

  private setCurrentPage(pageNumber: number) {
    this.pageNumber = pageNumber;
  }

  public rotate(rotation: number) {
    this.toolbarEvents.rotate(rotation);
  }

  public printFile() {
    this.toolbarEvents.print();
  }

  public downloadFile() {
    this.toolbarEvents.download();
  }

  public zoom(zoomFactor: string) {
    this.toolbarEvents.zoom(+zoomFactor);
  }

  public stepZoom(zoomFactor: number) {
    this.toolbarEvents.stepZoom(zoomFactor);
    this.zoomSelect.nativeElement.selected = 'selected';
  }
}
