import { Test, TestingModule } from '@nestjs/testing';
import { ParticipentService } from './Participent.service';

describe('ParticipentService', () => {
  let service: ParticipentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParticipentService],
    }).compile();

    service = module.get<ParticipentService>(ParticipentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
