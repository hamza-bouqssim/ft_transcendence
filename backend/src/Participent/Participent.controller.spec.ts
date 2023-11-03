import { Test, TestingModule } from '@nestjs/testing';
import { ParticipentController } from './Participent.controller';

describe('ParticipentController', () => {
  let controller: ParticipentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParticipentController],
    }).compile();

    controller = module.get<ParticipentController>(ParticipentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
