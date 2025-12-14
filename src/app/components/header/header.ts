import { Component, OnInit } from '@angular/core';
import { Pokemon } from '../../services/home/pokemon';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  offset: number = 0;
  limit: number = 40;

  constructor(private pokemonService: Pokemon) {}

   searchOfPokemon(name: string) {

    // Si el input está vacío, no buscar
    if (!name.trim()) {
      this.pokemonService.setPokemons(null as any);
      return;
    }

    this.pokemonService.getPokemons(this.offset, 1500)
      .subscribe((data: any) => {

        //To filter results by name
        const filtered = data.results.filter(
          (p: any) => p.name.toLowerCase().includes(name.toLowerCase())
        );

        //Pagination
        const paginatedResults = filtered.slice(this.offset, this.offset + this.limit);

        // 🔥 EMITIMOS el resultado
        this.pokemonService.setPokemons(paginatedResults);
      });
  }

  genOpen = false;
  typeOpen = false;

  toggleGenDropdown() {
    this.genOpen = !this.genOpen;
    this.typeOpen = false;
  }

  toggleTypeDropdown() {
    this.typeOpen = !this.typeOpen;
    this.genOpen = false;
  }

  selectGeneration(gen: number) {
    console.log('Generation selected:', gen);
    this.genOpen = false;
  }

  selectType(type: string) {
    console.log('Type selected:', type);
    this.typeOpen = false;
  }


}

