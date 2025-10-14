import { PaginationDto } from 'src/modules/base/dto/pagination.dto';

export class QueriesMessageInChannelDto extends PaginationDto {
    search?: string;
}
