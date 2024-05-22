import { Injectable } from '@nestjs/common';
import axios, {AxiosInstance} from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {  

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter
  ){}

  async executeSeed(){
    await this.pokemonModel.deleteMany({});//similar to delete * from pokemons
    const pokemonToInsert: {name:string,no:number}[] = [];
    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');

    data.results.forEach(async ({name,url}) => {
      const segment = url.split('/');
      const no = +segment[segment.length - 2];
      
      pokemonToInsert.push({name,no});
    });

    await this.pokemonModel.insertMany(pokemonToInsert);

    return "POKEMON SAVED";
  }
}
