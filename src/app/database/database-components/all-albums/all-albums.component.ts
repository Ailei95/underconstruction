import {Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Observable} from 'rxjs';
import {JsonPlaceholderApiService} from '../../database-services/json-placeholder-api.service';
import {Album} from '../../models/album';
import {map} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-all-albums',
  templateUrl: './all-albums.component.html',
  styleUrls: ['./all-albums.component.css']
})
export class AllAlbumsComponent implements OnInit, OnDestroy {

  @ViewChild('end') end: ElementRef;

  albums$: Observable<Album[]>;

  albumsLength: number;
  albumsToShow: number;

  callback: () => void;

  constructor(
    private ngZone: NgZone,
    private jsonPlaceholderApiService: JsonPlaceholderApiService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.albumsLength = 10;
    this.albumsToShow = 10;
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(
      (queryParams) => {
        if (queryParams.userId) {
          this.albums$ = this.jsonPlaceholderApiService.getAlbumsByUserId(queryParams.userId)
            .pipe(map((albums: Album[]) => {
              this.albumsLength = albums.length;
              return albums;
            }));
        } else {
          this.albums$ = this.jsonPlaceholderApiService.getAlbums()
            .pipe(map((albums: Album[]) => {
              this.albumsLength = albums.length;
              return albums;
            }));
        }
      });

    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.callback = () => {
        if ((window.innerHeight + window.scrollY) >= this.end.nativeElement.offsetTop) {
          if (this.albumsToShow < this.albumsLength) {
            this.ngZone.run(() => {
              this.albumsToShow = Math.min(this.albumsToShow + 10, this.albumsLength);
            });
          }
        }
      }, false);
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.callback, false);
  }
}
