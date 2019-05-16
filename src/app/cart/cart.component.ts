import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ToastService } from '../toast/toast.service';

export interface IBikes {
  id: number,
  image: string,
  description: string,
  price: number,
  quantity: number
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  bikes: Array<IBikes> = [];
  name: string;

  constructor(
    private http: Http,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) { }

  async ngOnInit() {
    this.bikes = await this.loadBikes();
  }

  async loadBikes() {
    let bikes = JSON.parse(localStorage.getItem('bikes'));
    if (bikes && bikes.length > 0) {
    } else {
      bikes = await this.LoadBikesFromJson();
    }
    this.bikes = bikes;
    return bikes;
  }
  async LoadBikesFromJson() {
    const bikes = await this.http.get('assets/inventory.json').toPromise();
    return bikes.json();
  }

  saveToLocalStorage() {
    localStorage.setItem('bikes', JSON.stringify(this.bikes));
  }

  saveNotification() {
    this.saveToLocalStorage();
    this.toastService.showToast('success', 2000, 'Successfully saved changes!');
  }

  addBike1() {
    const bike: IBikes = {
      "id": 1,
      "image": "../../assets/bike1.jpeg",
      "description": "Bike Model 1",
      "price": 5000,
      "quantity": 1
    }
    this.bikes.unshift(bike);
    this.saveToLocalStorage();

  }

  addBike2() {
    const bike: IBikes = {
      "id": 2,
      "image": "../../assets/bike2.jpeg",
      "description": "Bike Model 2",
      "price": 4000,
      "quantity": 2
    }
    this.bikes.unshift(bike);
    this.saveToLocalStorage();
  }

  addBike3() {
    const bike: IBikes = {
      "id": 3,
      "image": "../../assets/bike3.jpeg",
      "description": "Bike Model 3",
      "price": 3000,
      "quantity": 3
    }
    this.bikes.unshift(bike);
    this.saveToLocalStorage();
  }

  deleteBike(index: number) {
    this.bikes.splice(index, 1);
    this.saveToLocalStorage();
    this.toastService.showToast('danger', 1200, 'Successfully deleted item!');

  }

  calculate() {
    {
      let price = 0;
      for (let i = 0; i < this.bikes.length; i++) {
        price += this.bikes[i].price * this.bikes[i].quantity;

      }
      return {
        numberOfBikes: this.bikes.length,
        subTotal: price,
        taxAmount: price * .10,
        total: price + (price * .10),
      };
    }
  }

  checkout() {
    const commaIndex = this.name.indexOf(', ');
    let error = false;

    if (commaIndex === -1) {
      error = true;
      this.toastService.showToast('warning', 2500, 'Must contain , ');
    }
    if (this.name === '') {
      error = true;
      this.toastService.showToast('warning', 2500, 'Name field must not be empty!');
    } else {
      const firstName = this.name.slice(commaIndex + 1, this.name.length);
      const lastName = this.name.slice(0, commaIndex);
      error = false;
      const data = this.calculate();
      const fullName = firstName + ' ' + lastName;

      localStorage.setItem('calculatedData', JSON.stringify(data));
      localStorage.setItem('fullName', JSON.stringify(fullName));
      this.router.navigate(['invoice', data]);
    };

  }
}
