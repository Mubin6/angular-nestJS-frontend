import { Component, OnInit } from '@angular/core';
import { Item } from './items.interface';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { ItemsService } from './items.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit {

  items: Item [] = [{
    name: 'Pizza',
    price: 3
  },
  {
    name: 'Salad',
    price: 2
  }];

  itemSubmitted = false;
  itemForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private itemService: ItemsService,
  ) { }

  ngOnInit() {
    this.getItems();
    this.itemContentform();
  }

  getItems() {
    this.itemService.getItems()
    .subscribe((items) => {
      this.items = items;
      console.log('items', this.items);
    }
    );
  }

  itemContentform() {
    this.itemForm = this.formBuilder.group({
      name: ['', Validators.required], // Name is required
      price: ['', [Validators.required, Validators.min(0)]] // Price is required and must be a positive number
    });
  }

  get getItemForm() {
    return this.itemForm.controls;
  }

  /* addNewItem() {
    this.itemSubmitted = true;
    if (this.itemForm.invalid) {
      console.log(this.itemForm);
    } else {
      this.items.push(this.itemForm.value);
    }
  } */

  isAdmin() {
    return this.authService.isAdmin();
  }
  isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  addToCart() {
    this.itemService.postToShoppingCart().subscribe(response => {
    }, error => {
        window.alert(error.error.message || error.error.text);
        console.log(error);
    });
  }

  addNewItem() {
    this.itemSubmitted = true;

    if (!this.itemForm.invalid) {
      this.itemService.postItems(this.itemForm.value).subscribe(response => {
        console.log('response', response)
        window.location.reload();
      }, error => {
        window.alert(error.error.message);
      });
    }
  }
}
