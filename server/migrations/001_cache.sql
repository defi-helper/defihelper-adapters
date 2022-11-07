CREATE TABLE IF NOT EXISTS public.cache
(
    id character varying(36) COLLATE pg_catalog."default" NOT NULL,
    protocol character varying(256) COLLATE pg_catalog."default" NOT NULL,
    network character varying(64) COLLATE pg_catalog."default" NOT NULL,
    key character varying(256) COLLATE pg_catalog."default" NOT NULL,
    data jsonb NOT NULL,
    CONSTRAINT cache_pkey PRIMARY KEY (id)
);

CREATE UNIQUE INDEX IF NOT EXISTS cache_key_idx
    ON public.cache USING btree
    (protocol ASC NULLS LAST, network ASC NULLS LAST, key ASC NULLS LAST);