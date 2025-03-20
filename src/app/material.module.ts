import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatBadgeModule } from '@angular/material/badge';
import { NgModule } from '@angular/core';
import { AcronymPipe } from './commons/pipe/acronym.pipe';
import { KeysPipe } from './commons/pipe/keys.pipe';
import { XmaskPipe } from './commons/pipe/xmask.pipe';
import { PhoneNumberPipe } from './commons/pipe/phone-number.pipe';
import { NumberFormatPipe } from './commons/pipe/number-formate.pipe';
import { CustomNumberPipe } from './commons/pipe/custom-number.pipe';
import { IntegerPartPipe } from './commons/pipe/integer-digit';
import { TitleCasePipe } from './commons/pipe/titleCase-companyName.pipe';
import { ConvertEndPipe } from './commons/pipe/convertEnd.pipe';
import { AcronymForOneLetterPipe } from './commons/pipe/acronym-for-one-letter.pipe';

@NgModule({
  imports: [
    MatCheckboxModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatStepperModule,
    MatTabsModule,
    MatExpansionModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatDialogModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatBadgeModule,
  ],
  providers: [{ provide: MatDialogRef, useValue: {} }],

  declarations: [
    AcronymPipe,
    KeysPipe,
    XmaskPipe,
    PhoneNumberPipe,
    NumberFormatPipe,
    CustomNumberPipe,
    IntegerPartPipe,
    TitleCasePipe,
    ConvertEndPipe,
    AcronymForOneLetterPipe
  ],

  bootstrap: [],
  exports: [
    MatCheckboxModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatStepperModule,
    MatTabsModule,
    MatExpansionModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatDialogModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatNativeDateModule,
    MatRippleModule,
    MatBadgeModule,
    AcronymPipe,
    KeysPipe,
    XmaskPipe,
    PhoneNumberPipe,
    NumberFormatPipe,
    CustomNumberPipe,
    IntegerPartPipe,
    TitleCasePipe,
    ConvertEndPipe,
    AcronymForOneLetterPipe

    
  ],
})
export class MaterialModule { }
