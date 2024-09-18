import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Software } from "./software";

@Entity()
export class ImagenPreview extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({length: 255})
    public imagen: string;

    @ManyToOne(() => Software, software => software.imagenesPreview, {onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    public software: Software;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}