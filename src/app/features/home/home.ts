import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Pokemon } from '../../services/home/pokemon';
import { NgFor } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  styleUrl: './home.css',
  imports: [NgFor],
})
export class Home implements OnInit {

  // Variable for save the pokemons
  pokemons: any[] = [];
  offset: number = 0;
  limit: number = 40;

  private searchSub!: Subscription;

  constructor(private pokemonService: Pokemon, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadPokemons();

    // 2️⃣ Escuchar búsquedas del Header
    this.searchSub = this.pokemonService.pokemonSearch$
      .subscribe(searchResults => {

        if (searchResults.length > 0) {
          // Show sorting with pagination
          this.pokemons = searchResults.slice(this.offset, this.offset + this.limit); // Apply the pagination
        } else {
          // Return to the normal pagination
          
          this.loadPokemons();
        }

      });
  }

  ngOnDestroy(): void {
    // 3️⃣ Limpieza (buena práctica)
    this.searchSub.unsubscribe();
  }


  loadPokemons() {
    this.pokemonService.getPokemons(this.offset, this.limit).subscribe((data: any) => {
      this.pokemons = data.results; 
      console.log(this.pokemons);
      this.cd.detectChanges();
    });
  }


  MorePokemon() {
    this.offset += this.limit;
    this.pokemonService.getPokemons(this.offset, this.limit).subscribe((data: any) => {
      this.pokemons = data.results; 
      console.log(this.pokemons);
      this.cd.detectChanges();
    });
  }
  
  LessPokemon() {
    if (!(this.offset < this.limit)) {
      this.offset -= this.limit;
      this.pokemonService.getPokemons(this.offset, this.limit).subscribe((data: any) => {
        this.pokemons = data.results;
        console.log(this.pokemons);
        this.cd.detectChanges();
      })
    } 
  }
}
