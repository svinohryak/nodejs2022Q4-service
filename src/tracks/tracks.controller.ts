import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CreateTrackDto } from './create-track.dto';
import { TracksService } from './tracks.service';

@Controller('track')
export class TracksController {
  constructor(private readonly trackService: TracksService) {}

  @Post()
  create(@Body() dto: CreateTrackDto) {
    return this.trackService.createTrack(dto);
  }

  @Get()
  async getAllTracks() {
    return await this.trackService.getAllTracks();
  }

  @Get(':id')
  getTrackById(
    @Param(
      'id',
      new ParseUUIDPipe({
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
        version: '4',
      }),
    )
    id: string,
  ) {
    return this.trackService.getTrack(id);
  }

  @Put(':id')
  update(
    @Param(
      'id',
      new ParseUUIDPipe({
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
        version: '4',
      }),
    )
    id: string,
    @Body() dto: CreateTrackDto,
  ) {
    return this.trackService.updateTrack(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(
    @Param(
      'id',
      new ParseUUIDPipe({
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
        version: '4',
      }),
    )
    id: string,
  ) {
    return this.trackService.deleteTrack(id);
  }
}
