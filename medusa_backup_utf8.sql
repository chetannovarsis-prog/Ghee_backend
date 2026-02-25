--
-- PostgreSQL database dump
--

\restrict egq1a9YDs4PBapL47FhN5AcgatdvCTzVpDcdz7A44gLf7QsjNeUb6JycBMfOCxK

-- Dumped from database version 18.2
-- Dumped by pg_dump version 18.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: claim_reason_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.claim_reason_enum AS ENUM (
    'missing_item',
    'wrong_item',
    'production_failure',
    'other'
);


ALTER TYPE public.claim_reason_enum OWNER TO postgres;

--
-- Name: order_claim_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.order_claim_type_enum AS ENUM (
    'refund',
    'replace'
);


ALTER TYPE public.order_claim_type_enum OWNER TO postgres;

--
-- Name: order_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.order_status_enum AS ENUM (
    'pending',
    'completed',
    'draft',
    'archived',
    'canceled',
    'requires_action'
);


ALTER TYPE public.order_status_enum OWNER TO postgres;

--
-- Name: return_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.return_status_enum AS ENUM (
    'open',
    'requested',
    'received',
    'partially_received',
    'canceled'
);


ALTER TYPE public.return_status_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: account_holder; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.account_holder (
    id text NOT NULL,
    provider_id text NOT NULL,
    external_id text NOT NULL,
    email text,
    data jsonb DEFAULT '{}'::jsonb NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.account_holder OWNER TO postgres;

--
-- Name: api_key; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.api_key (
    id text NOT NULL,
    token text NOT NULL,
    salt text NOT NULL,
    redacted text NOT NULL,
    title text NOT NULL,
    type text NOT NULL,
    last_used_at timestamp with time zone,
    created_by text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    revoked_by text,
    revoked_at timestamp with time zone,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT api_key_type_check CHECK ((type = ANY (ARRAY['publishable'::text, 'secret'::text])))
);


ALTER TABLE public.api_key OWNER TO postgres;

--
-- Name: application_method_buy_rules; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.application_method_buy_rules (
    application_method_id text NOT NULL,
    promotion_rule_id text NOT NULL
);


ALTER TABLE public.application_method_buy_rules OWNER TO postgres;

--
-- Name: application_method_target_rules; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.application_method_target_rules (
    application_method_id text NOT NULL,
    promotion_rule_id text NOT NULL
);


ALTER TABLE public.application_method_target_rules OWNER TO postgres;

--
-- Name: auth_identity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auth_identity (
    id text NOT NULL,
    app_metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.auth_identity OWNER TO postgres;

--
-- Name: capture; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.capture (
    id text NOT NULL,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    payment_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    created_by text,
    metadata jsonb
);


ALTER TABLE public.capture OWNER TO postgres;

--
-- Name: cart; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart (
    id text NOT NULL,
    region_id text,
    customer_id text,
    sales_channel_id text,
    email text,
    currency_code text NOT NULL,
    shipping_address_id text,
    billing_address_id text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    completed_at timestamp with time zone,
    locale text
);


ALTER TABLE public.cart OWNER TO postgres;

--
-- Name: cart_address; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_address (
    id text NOT NULL,
    customer_id text,
    company text,
    first_name text,
    last_name text,
    address_1 text,
    address_2 text,
    city text,
    country_code text,
    province text,
    postal_code text,
    phone text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.cart_address OWNER TO postgres;

--
-- Name: cart_line_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_line_item (
    id text NOT NULL,
    cart_id text NOT NULL,
    title text NOT NULL,
    subtitle text,
    thumbnail text,
    quantity integer NOT NULL,
    variant_id text,
    product_id text,
    product_title text,
    product_description text,
    product_subtitle text,
    product_type text,
    product_collection text,
    product_handle text,
    variant_sku text,
    variant_barcode text,
    variant_title text,
    variant_option_values jsonb,
    requires_shipping boolean DEFAULT true NOT NULL,
    is_discountable boolean DEFAULT true NOT NULL,
    is_tax_inclusive boolean DEFAULT false NOT NULL,
    compare_at_unit_price numeric,
    raw_compare_at_unit_price jsonb,
    unit_price numeric NOT NULL,
    raw_unit_price jsonb NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    product_type_id text,
    is_custom_price boolean DEFAULT false NOT NULL,
    is_giftcard boolean DEFAULT false NOT NULL,
    CONSTRAINT cart_line_item_unit_price_check CHECK ((unit_price >= (0)::numeric))
);


ALTER TABLE public.cart_line_item OWNER TO postgres;

--
-- Name: cart_line_item_adjustment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_line_item_adjustment (
    id text NOT NULL,
    description text,
    promotion_id text,
    code text,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    provider_id text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    item_id text,
    is_tax_inclusive boolean DEFAULT false NOT NULL,
    CONSTRAINT cart_line_item_adjustment_check CHECK ((amount >= (0)::numeric))
);


ALTER TABLE public.cart_line_item_adjustment OWNER TO postgres;

--
-- Name: cart_line_item_tax_line; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_line_item_tax_line (
    id text NOT NULL,
    description text,
    tax_rate_id text,
    code text NOT NULL,
    rate real NOT NULL,
    provider_id text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    item_id text
);


ALTER TABLE public.cart_line_item_tax_line OWNER TO postgres;

--
-- Name: cart_payment_collection; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_payment_collection (
    cart_id character varying(255) NOT NULL,
    payment_collection_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.cart_payment_collection OWNER TO postgres;

--
-- Name: cart_promotion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_promotion (
    cart_id character varying(255) NOT NULL,
    promotion_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.cart_promotion OWNER TO postgres;

--
-- Name: cart_shipping_method; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_shipping_method (
    id text NOT NULL,
    cart_id text NOT NULL,
    name text NOT NULL,
    description jsonb,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    is_tax_inclusive boolean DEFAULT false NOT NULL,
    shipping_option_id text,
    data jsonb,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT cart_shipping_method_check CHECK ((amount >= (0)::numeric))
);


ALTER TABLE public.cart_shipping_method OWNER TO postgres;

--
-- Name: cart_shipping_method_adjustment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_shipping_method_adjustment (
    id text NOT NULL,
    description text,
    promotion_id text,
    code text,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    provider_id text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    shipping_method_id text
);


ALTER TABLE public.cart_shipping_method_adjustment OWNER TO postgres;

--
-- Name: cart_shipping_method_tax_line; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_shipping_method_tax_line (
    id text NOT NULL,
    description text,
    tax_rate_id text,
    code text NOT NULL,
    rate real NOT NULL,
    provider_id text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    shipping_method_id text
);


ALTER TABLE public.cart_shipping_method_tax_line OWNER TO postgres;

--
-- Name: credit_line; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.credit_line (
    id text NOT NULL,
    cart_id text NOT NULL,
    reference text,
    reference_id text,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.credit_line OWNER TO postgres;

--
-- Name: currency; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.currency (
    code text NOT NULL,
    symbol text NOT NULL,
    symbol_native text NOT NULL,
    decimal_digits integer DEFAULT 0 NOT NULL,
    rounding numeric DEFAULT 0 NOT NULL,
    raw_rounding jsonb NOT NULL,
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.currency OWNER TO postgres;

--
-- Name: customer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customer (
    id text NOT NULL,
    company_name text,
    first_name text,
    last_name text,
    email text,
    phone text,
    has_account boolean DEFAULT false NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    created_by text
);


ALTER TABLE public.customer OWNER TO postgres;

--
-- Name: customer_account_holder; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customer_account_holder (
    customer_id character varying(255) NOT NULL,
    account_holder_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.customer_account_holder OWNER TO postgres;

--
-- Name: customer_address; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customer_address (
    id text NOT NULL,
    customer_id text NOT NULL,
    address_name text,
    is_default_shipping boolean DEFAULT false NOT NULL,
    is_default_billing boolean DEFAULT false NOT NULL,
    company text,
    first_name text,
    last_name text,
    address_1 text,
    address_2 text,
    city text,
    country_code text,
    province text,
    postal_code text,
    phone text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.customer_address OWNER TO postgres;

--
-- Name: customer_group; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customer_group (
    id text NOT NULL,
    name text NOT NULL,
    metadata jsonb,
    created_by text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.customer_group OWNER TO postgres;

--
-- Name: customer_group_customer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customer_group_customer (
    id text NOT NULL,
    customer_id text NOT NULL,
    customer_group_id text NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by text,
    deleted_at timestamp with time zone
);


ALTER TABLE public.customer_group_customer OWNER TO postgres;

--
-- Name: fulfillment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fulfillment (
    id text NOT NULL,
    location_id text NOT NULL,
    packed_at timestamp with time zone,
    shipped_at timestamp with time zone,
    delivered_at timestamp with time zone,
    canceled_at timestamp with time zone,
    data jsonb,
    provider_id text,
    shipping_option_id text,
    metadata jsonb,
    delivery_address_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    marked_shipped_by text,
    created_by text,
    requires_shipping boolean DEFAULT true NOT NULL
);


ALTER TABLE public.fulfillment OWNER TO postgres;

--
-- Name: fulfillment_address; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fulfillment_address (
    id text NOT NULL,
    company text,
    first_name text,
    last_name text,
    address_1 text,
    address_2 text,
    city text,
    country_code text,
    province text,
    postal_code text,
    phone text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.fulfillment_address OWNER TO postgres;

--
-- Name: fulfillment_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fulfillment_item (
    id text NOT NULL,
    title text NOT NULL,
    sku text NOT NULL,
    barcode text NOT NULL,
    quantity numeric NOT NULL,
    raw_quantity jsonb NOT NULL,
    line_item_id text,
    inventory_item_id text,
    fulfillment_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.fulfillment_item OWNER TO postgres;

--
-- Name: fulfillment_label; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fulfillment_label (
    id text NOT NULL,
    tracking_number text NOT NULL,
    tracking_url text NOT NULL,
    label_url text NOT NULL,
    fulfillment_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.fulfillment_label OWNER TO postgres;

--
-- Name: fulfillment_provider; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fulfillment_provider (
    id text NOT NULL,
    is_enabled boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.fulfillment_provider OWNER TO postgres;

--
-- Name: fulfillment_set; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fulfillment_set (
    id text NOT NULL,
    name text NOT NULL,
    type text NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.fulfillment_set OWNER TO postgres;

--
-- Name: geo_zone; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.geo_zone (
    id text NOT NULL,
    type text DEFAULT 'country'::text NOT NULL,
    country_code text NOT NULL,
    province_code text,
    city text,
    service_zone_id text NOT NULL,
    postal_expression jsonb,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT geo_zone_type_check CHECK ((type = ANY (ARRAY['country'::text, 'province'::text, 'city'::text, 'zip'::text])))
);


ALTER TABLE public.geo_zone OWNER TO postgres;

--
-- Name: image; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.image (
    id text NOT NULL,
    url text NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    rank integer DEFAULT 0 NOT NULL,
    product_id text NOT NULL
);


ALTER TABLE public.image OWNER TO postgres;

--
-- Name: inventory_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventory_item (
    id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    sku text,
    origin_country text,
    hs_code text,
    mid_code text,
    material text,
    weight integer,
    length integer,
    height integer,
    width integer,
    requires_shipping boolean DEFAULT true NOT NULL,
    description text,
    title text,
    thumbnail text,
    metadata jsonb
);


ALTER TABLE public.inventory_item OWNER TO postgres;

--
-- Name: inventory_level; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventory_level (
    id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    inventory_item_id text NOT NULL,
    location_id text NOT NULL,
    stocked_quantity numeric DEFAULT 0 NOT NULL,
    reserved_quantity numeric DEFAULT 0 NOT NULL,
    incoming_quantity numeric DEFAULT 0 NOT NULL,
    metadata jsonb,
    raw_stocked_quantity jsonb,
    raw_reserved_quantity jsonb,
    raw_incoming_quantity jsonb
);


ALTER TABLE public.inventory_level OWNER TO postgres;

--
-- Name: invite; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invite (
    id text NOT NULL,
    email text NOT NULL,
    accepted boolean DEFAULT false NOT NULL,
    token text NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.invite OWNER TO postgres;

--
-- Name: link_module_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.link_module_migrations (
    id integer NOT NULL,
    table_name character varying(255) NOT NULL,
    link_descriptor jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.link_module_migrations OWNER TO postgres;

--
-- Name: link_module_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.link_module_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.link_module_migrations_id_seq OWNER TO postgres;

--
-- Name: link_module_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.link_module_migrations_id_seq OWNED BY public.link_module_migrations.id;


--
-- Name: location_fulfillment_provider; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.location_fulfillment_provider (
    stock_location_id character varying(255) NOT NULL,
    fulfillment_provider_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.location_fulfillment_provider OWNER TO postgres;

--
-- Name: location_fulfillment_set; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.location_fulfillment_set (
    stock_location_id character varying(255) NOT NULL,
    fulfillment_set_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.location_fulfillment_set OWNER TO postgres;

--
-- Name: mikro_orm_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mikro_orm_migrations (
    id integer NOT NULL,
    name character varying(255),
    executed_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.mikro_orm_migrations OWNER TO postgres;

--
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mikro_orm_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mikro_orm_migrations_id_seq OWNER TO postgres;

--
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mikro_orm_migrations_id_seq OWNED BY public.mikro_orm_migrations.id;


--
-- Name: notification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notification (
    id text NOT NULL,
    "to" text NOT NULL,
    channel text NOT NULL,
    template text,
    data jsonb,
    trigger_type text,
    resource_id text,
    resource_type text,
    receiver_id text,
    original_notification_id text,
    idempotency_key text,
    external_id text,
    provider_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    status text DEFAULT 'pending'::text NOT NULL,
    "from" text,
    provider_data jsonb,
    CONSTRAINT notification_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'success'::text, 'failure'::text])))
);


ALTER TABLE public.notification OWNER TO postgres;

--
-- Name: notification_provider; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notification_provider (
    id text NOT NULL,
    handle text NOT NULL,
    name text NOT NULL,
    is_enabled boolean DEFAULT true NOT NULL,
    channels text[] DEFAULT '{}'::text[] NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.notification_provider OWNER TO postgres;

--
-- Name: order; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."order" (
    id text NOT NULL,
    region_id text,
    display_id integer,
    customer_id text,
    version integer DEFAULT 1 NOT NULL,
    sales_channel_id text,
    status public.order_status_enum DEFAULT 'pending'::public.order_status_enum NOT NULL,
    is_draft_order boolean DEFAULT false NOT NULL,
    email text,
    currency_code text NOT NULL,
    shipping_address_id text,
    billing_address_id text,
    no_notification boolean,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    canceled_at timestamp with time zone,
    custom_display_id text,
    locale text
);


ALTER TABLE public."order" OWNER TO postgres;

--
-- Name: order_address; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_address (
    id text NOT NULL,
    customer_id text,
    company text,
    first_name text,
    last_name text,
    address_1 text,
    address_2 text,
    city text,
    country_code text,
    province text,
    postal_code text,
    phone text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.order_address OWNER TO postgres;

--
-- Name: order_cart; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_cart (
    order_id character varying(255) NOT NULL,
    cart_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.order_cart OWNER TO postgres;

--
-- Name: order_change; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_change (
    id text NOT NULL,
    order_id text NOT NULL,
    version integer NOT NULL,
    description text,
    status text DEFAULT 'pending'::text NOT NULL,
    internal_note text,
    created_by text,
    requested_by text,
    requested_at timestamp with time zone,
    confirmed_by text,
    confirmed_at timestamp with time zone,
    declined_by text,
    declined_reason text,
    metadata jsonb,
    declined_at timestamp with time zone,
    canceled_by text,
    canceled_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    change_type text,
    deleted_at timestamp with time zone,
    return_id text,
    claim_id text,
    exchange_id text,
    carry_over_promotions boolean,
    CONSTRAINT order_change_status_check CHECK ((status = ANY (ARRAY['confirmed'::text, 'declined'::text, 'requested'::text, 'pending'::text, 'canceled'::text])))
);


ALTER TABLE public.order_change OWNER TO postgres;

--
-- Name: order_change_action; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_change_action (
    id text NOT NULL,
    order_id text,
    version integer,
    ordering bigint NOT NULL,
    order_change_id text,
    reference text,
    reference_id text,
    action text NOT NULL,
    details jsonb,
    amount numeric,
    raw_amount jsonb,
    internal_note text,
    applied boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    return_id text,
    claim_id text,
    exchange_id text
);


ALTER TABLE public.order_change_action OWNER TO postgres;

--
-- Name: order_change_action_ordering_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_change_action_ordering_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_change_action_ordering_seq OWNER TO postgres;

--
-- Name: order_change_action_ordering_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_change_action_ordering_seq OWNED BY public.order_change_action.ordering;


--
-- Name: order_claim; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_claim (
    id text NOT NULL,
    order_id text NOT NULL,
    return_id text,
    order_version integer NOT NULL,
    display_id integer NOT NULL,
    type public.order_claim_type_enum NOT NULL,
    no_notification boolean,
    refund_amount numeric,
    raw_refund_amount jsonb,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    canceled_at timestamp with time zone,
    created_by text
);


ALTER TABLE public.order_claim OWNER TO postgres;

--
-- Name: order_claim_display_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_claim_display_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_claim_display_id_seq OWNER TO postgres;

--
-- Name: order_claim_display_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_claim_display_id_seq OWNED BY public.order_claim.display_id;


--
-- Name: order_claim_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_claim_item (
    id text NOT NULL,
    claim_id text NOT NULL,
    item_id text NOT NULL,
    is_additional_item boolean DEFAULT false NOT NULL,
    reason public.claim_reason_enum,
    quantity numeric NOT NULL,
    raw_quantity jsonb NOT NULL,
    note text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.order_claim_item OWNER TO postgres;

--
-- Name: order_claim_item_image; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_claim_item_image (
    id text NOT NULL,
    claim_item_id text NOT NULL,
    url text NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.order_claim_item_image OWNER TO postgres;

--
-- Name: order_credit_line; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_credit_line (
    id text NOT NULL,
    order_id text NOT NULL,
    reference text,
    reference_id text,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    version integer DEFAULT 1 NOT NULL
);


ALTER TABLE public.order_credit_line OWNER TO postgres;

--
-- Name: order_display_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_display_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_display_id_seq OWNER TO postgres;

--
-- Name: order_display_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_display_id_seq OWNED BY public."order".display_id;


--
-- Name: order_exchange; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_exchange (
    id text NOT NULL,
    order_id text NOT NULL,
    return_id text,
    order_version integer NOT NULL,
    display_id integer NOT NULL,
    no_notification boolean,
    allow_backorder boolean DEFAULT false NOT NULL,
    difference_due numeric,
    raw_difference_due jsonb,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    canceled_at timestamp with time zone,
    created_by text
);


ALTER TABLE public.order_exchange OWNER TO postgres;

--
-- Name: order_exchange_display_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_exchange_display_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_exchange_display_id_seq OWNER TO postgres;

--
-- Name: order_exchange_display_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_exchange_display_id_seq OWNED BY public.order_exchange.display_id;


--
-- Name: order_exchange_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_exchange_item (
    id text NOT NULL,
    exchange_id text NOT NULL,
    item_id text NOT NULL,
    quantity numeric NOT NULL,
    raw_quantity jsonb NOT NULL,
    note text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.order_exchange_item OWNER TO postgres;

--
-- Name: order_fulfillment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_fulfillment (
    order_id character varying(255) NOT NULL,
    fulfillment_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.order_fulfillment OWNER TO postgres;

--
-- Name: order_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_item (
    id text NOT NULL,
    order_id text NOT NULL,
    version integer NOT NULL,
    item_id text NOT NULL,
    quantity numeric NOT NULL,
    raw_quantity jsonb NOT NULL,
    fulfilled_quantity numeric NOT NULL,
    raw_fulfilled_quantity jsonb DEFAULT '{"value": "0", "precision": 20}'::jsonb NOT NULL,
    shipped_quantity numeric NOT NULL,
    raw_shipped_quantity jsonb DEFAULT '{"value": "0", "precision": 20}'::jsonb NOT NULL,
    return_requested_quantity numeric NOT NULL,
    raw_return_requested_quantity jsonb DEFAULT '{"value": "0", "precision": 20}'::jsonb NOT NULL,
    return_received_quantity numeric NOT NULL,
    raw_return_received_quantity jsonb DEFAULT '{"value": "0", "precision": 20}'::jsonb NOT NULL,
    return_dismissed_quantity numeric NOT NULL,
    raw_return_dismissed_quantity jsonb DEFAULT '{"value": "0", "precision": 20}'::jsonb NOT NULL,
    written_off_quantity numeric NOT NULL,
    raw_written_off_quantity jsonb DEFAULT '{"value": "0", "precision": 20}'::jsonb NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    delivered_quantity numeric DEFAULT 0 NOT NULL,
    raw_delivered_quantity jsonb DEFAULT '{"value": "0", "precision": 20}'::jsonb NOT NULL,
    unit_price numeric,
    raw_unit_price jsonb,
    compare_at_unit_price numeric,
    raw_compare_at_unit_price jsonb
);


ALTER TABLE public.order_item OWNER TO postgres;

--
-- Name: order_line_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_line_item (
    id text NOT NULL,
    totals_id text,
    title text NOT NULL,
    subtitle text,
    thumbnail text,
    variant_id text,
    product_id text,
    product_title text,
    product_description text,
    product_subtitle text,
    product_type text,
    product_collection text,
    product_handle text,
    variant_sku text,
    variant_barcode text,
    variant_title text,
    variant_option_values jsonb,
    requires_shipping boolean DEFAULT true NOT NULL,
    is_discountable boolean DEFAULT true NOT NULL,
    is_tax_inclusive boolean DEFAULT false NOT NULL,
    compare_at_unit_price numeric,
    raw_compare_at_unit_price jsonb,
    unit_price numeric NOT NULL,
    raw_unit_price jsonb NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    is_custom_price boolean DEFAULT false NOT NULL,
    product_type_id text,
    is_giftcard boolean DEFAULT false NOT NULL
);


ALTER TABLE public.order_line_item OWNER TO postgres;

--
-- Name: order_line_item_adjustment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_line_item_adjustment (
    id text NOT NULL,
    description text,
    promotion_id text,
    code text,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    provider_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    item_id text NOT NULL,
    deleted_at timestamp with time zone,
    is_tax_inclusive boolean DEFAULT false NOT NULL,
    version integer DEFAULT 1 NOT NULL
);


ALTER TABLE public.order_line_item_adjustment OWNER TO postgres;

--
-- Name: order_line_item_tax_line; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_line_item_tax_line (
    id text NOT NULL,
    description text,
    tax_rate_id text,
    code text NOT NULL,
    rate numeric NOT NULL,
    raw_rate jsonb NOT NULL,
    provider_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    item_id text NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.order_line_item_tax_line OWNER TO postgres;

--
-- Name: order_payment_collection; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_payment_collection (
    order_id character varying(255) NOT NULL,
    payment_collection_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.order_payment_collection OWNER TO postgres;

--
-- Name: order_promotion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_promotion (
    order_id character varying(255) NOT NULL,
    promotion_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.order_promotion OWNER TO postgres;

--
-- Name: order_shipping; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_shipping (
    id text NOT NULL,
    order_id text NOT NULL,
    version integer NOT NULL,
    shipping_method_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    return_id text,
    claim_id text,
    exchange_id text
);


ALTER TABLE public.order_shipping OWNER TO postgres;

--
-- Name: order_shipping_method; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_shipping_method (
    id text NOT NULL,
    name text NOT NULL,
    description jsonb,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    is_tax_inclusive boolean DEFAULT false NOT NULL,
    shipping_option_id text,
    data jsonb,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    is_custom_amount boolean DEFAULT false NOT NULL
);


ALTER TABLE public.order_shipping_method OWNER TO postgres;

--
-- Name: order_shipping_method_adjustment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_shipping_method_adjustment (
    id text NOT NULL,
    description text,
    promotion_id text,
    code text,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    provider_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    shipping_method_id text NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.order_shipping_method_adjustment OWNER TO postgres;

--
-- Name: order_shipping_method_tax_line; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_shipping_method_tax_line (
    id text NOT NULL,
    description text,
    tax_rate_id text,
    code text NOT NULL,
    rate numeric NOT NULL,
    raw_rate jsonb NOT NULL,
    provider_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    shipping_method_id text NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.order_shipping_method_tax_line OWNER TO postgres;

--
-- Name: order_summary; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_summary (
    id text NOT NULL,
    order_id text NOT NULL,
    version integer DEFAULT 1 NOT NULL,
    totals jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.order_summary OWNER TO postgres;

--
-- Name: order_transaction; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_transaction (
    id text NOT NULL,
    order_id text NOT NULL,
    version integer DEFAULT 1 NOT NULL,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    currency_code text NOT NULL,
    reference text,
    reference_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    return_id text,
    claim_id text,
    exchange_id text
);


ALTER TABLE public.order_transaction OWNER TO postgres;

--
-- Name: payment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment (
    id text NOT NULL,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    currency_code text NOT NULL,
    provider_id text CONSTRAINT payment_provider_id_not_null1 NOT NULL,
    data jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    captured_at timestamp with time zone,
    canceled_at timestamp with time zone,
    payment_collection_id text NOT NULL,
    payment_session_id text NOT NULL,
    metadata jsonb
);


ALTER TABLE public.payment OWNER TO postgres;

--
-- Name: payment_collection; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment_collection (
    id text NOT NULL,
    currency_code text NOT NULL,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    authorized_amount numeric,
    raw_authorized_amount jsonb,
    captured_amount numeric,
    raw_captured_amount jsonb,
    refunded_amount numeric,
    raw_refunded_amount jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    completed_at timestamp with time zone,
    status text DEFAULT 'not_paid'::text NOT NULL,
    metadata jsonb,
    CONSTRAINT payment_collection_status_check CHECK ((status = ANY (ARRAY['not_paid'::text, 'awaiting'::text, 'authorized'::text, 'partially_authorized'::text, 'canceled'::text, 'failed'::text, 'partially_captured'::text, 'completed'::text])))
);


ALTER TABLE public.payment_collection OWNER TO postgres;

--
-- Name: payment_collection_payment_providers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment_collection_payment_providers (
    payment_collection_id text CONSTRAINT payment_collection_payment_provi_payment_collection_id_not_null NOT NULL,
    payment_provider_id text CONSTRAINT payment_collection_payment_provide_payment_provider_id_not_null NOT NULL
);


ALTER TABLE public.payment_collection_payment_providers OWNER TO postgres;

--
-- Name: payment_provider; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment_provider (
    id text NOT NULL,
    is_enabled boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.payment_provider OWNER TO postgres;

--
-- Name: payment_session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment_session (
    id text NOT NULL,
    currency_code text NOT NULL,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    provider_id text NOT NULL,
    data jsonb DEFAULT '{}'::jsonb NOT NULL,
    context jsonb,
    status text DEFAULT 'pending'::text NOT NULL,
    authorized_at timestamp with time zone,
    payment_collection_id text NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT payment_session_status_check CHECK ((status = ANY (ARRAY['authorized'::text, 'captured'::text, 'pending'::text, 'requires_more'::text, 'error'::text, 'canceled'::text])))
);


ALTER TABLE public.payment_session OWNER TO postgres;

--
-- Name: price; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.price (
    id text NOT NULL,
    title text,
    price_set_id text NOT NULL,
    currency_code text CONSTRAINT price_money_amount_id_not_null NOT NULL,
    raw_amount jsonb NOT NULL,
    rules_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    price_list_id text,
    amount numeric NOT NULL,
    min_quantity numeric,
    max_quantity numeric,
    raw_min_quantity jsonb,
    raw_max_quantity jsonb
);


ALTER TABLE public.price OWNER TO postgres;

--
-- Name: price_list; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.price_list (
    id text NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL,
    starts_at timestamp with time zone,
    ends_at timestamp with time zone,
    rules_count integer DEFAULT 0,
    title text NOT NULL,
    description text NOT NULL,
    type text DEFAULT 'sale'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT price_list_status_check CHECK ((status = ANY (ARRAY['active'::text, 'draft'::text]))),
    CONSTRAINT price_list_type_check CHECK ((type = ANY (ARRAY['sale'::text, 'override'::text])))
);


ALTER TABLE public.price_list OWNER TO postgres;

--
-- Name: price_list_rule; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.price_list_rule (
    id text NOT NULL,
    price_list_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    value jsonb,
    attribute text DEFAULT ''::text NOT NULL
);


ALTER TABLE public.price_list_rule OWNER TO postgres;

--
-- Name: price_preference; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.price_preference (
    id text NOT NULL,
    attribute text NOT NULL,
    value text,
    is_tax_inclusive boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.price_preference OWNER TO postgres;

--
-- Name: price_rule; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.price_rule (
    id text NOT NULL,
    value text NOT NULL,
    priority integer DEFAULT 0 NOT NULL,
    price_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    attribute text DEFAULT ''::text NOT NULL,
    operator text DEFAULT 'eq'::text NOT NULL,
    CONSTRAINT price_rule_operator_check CHECK ((operator = ANY (ARRAY['gte'::text, 'lte'::text, 'gt'::text, 'lt'::text, 'eq'::text])))
);


ALTER TABLE public.price_rule OWNER TO postgres;

--
-- Name: price_set; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.price_set (
    id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.price_set OWNER TO postgres;

--
-- Name: product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product (
    id text NOT NULL,
    title text NOT NULL,
    handle text NOT NULL,
    subtitle text,
    description text,
    is_giftcard boolean DEFAULT false NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL,
    thumbnail text,
    weight text,
    length text,
    height text,
    width text,
    origin_country text,
    hs_code text,
    mid_code text,
    material text,
    collection_id text,
    type_id text,
    discountable boolean DEFAULT true NOT NULL,
    external_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    metadata jsonb,
    CONSTRAINT product_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'proposed'::text, 'published'::text, 'rejected'::text])))
);


ALTER TABLE public.product OWNER TO postgres;

--
-- Name: product_category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_category (
    id text NOT NULL,
    name text NOT NULL,
    description text DEFAULT ''::text NOT NULL,
    handle text NOT NULL,
    mpath text NOT NULL,
    is_active boolean DEFAULT false NOT NULL,
    is_internal boolean DEFAULT false NOT NULL,
    rank integer DEFAULT 0 NOT NULL,
    parent_category_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    metadata jsonb
);


ALTER TABLE public.product_category OWNER TO postgres;

--
-- Name: product_category_product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_category_product (
    product_id text NOT NULL,
    product_category_id text NOT NULL
);


ALTER TABLE public.product_category_product OWNER TO postgres;

--
-- Name: product_collection; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_collection (
    id text NOT NULL,
    title text NOT NULL,
    handle text NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.product_collection OWNER TO postgres;

--
-- Name: product_option; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_option (
    id text NOT NULL,
    title text NOT NULL,
    product_id text NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.product_option OWNER TO postgres;

--
-- Name: product_option_value; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_option_value (
    id text NOT NULL,
    value text NOT NULL,
    option_id text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.product_option_value OWNER TO postgres;

--
-- Name: product_sales_channel; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_sales_channel (
    product_id character varying(255) NOT NULL,
    sales_channel_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.product_sales_channel OWNER TO postgres;

--
-- Name: product_shipping_profile; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_shipping_profile (
    product_id character varying(255) NOT NULL,
    shipping_profile_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.product_shipping_profile OWNER TO postgres;

--
-- Name: product_tag; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_tag (
    id text NOT NULL,
    value text NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.product_tag OWNER TO postgres;

--
-- Name: product_tags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_tags (
    product_id text NOT NULL,
    product_tag_id text NOT NULL
);


ALTER TABLE public.product_tags OWNER TO postgres;

--
-- Name: product_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_type (
    id text NOT NULL,
    value text NOT NULL,
    metadata json,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.product_type OWNER TO postgres;

--
-- Name: product_variant; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_variant (
    id text NOT NULL,
    title text NOT NULL,
    sku text,
    barcode text,
    ean text,
    upc text,
    allow_backorder boolean DEFAULT false NOT NULL,
    manage_inventory boolean DEFAULT true NOT NULL,
    hs_code text,
    origin_country text,
    mid_code text,
    material text,
    weight integer,
    length integer,
    height integer,
    width integer,
    metadata jsonb,
    variant_rank integer DEFAULT 0,
    product_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    thumbnail text
);


ALTER TABLE public.product_variant OWNER TO postgres;

--
-- Name: product_variant_inventory_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_variant_inventory_item (
    variant_id character varying(255) NOT NULL,
    inventory_item_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    required_quantity integer DEFAULT 1 NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.product_variant_inventory_item OWNER TO postgres;

--
-- Name: product_variant_option; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_variant_option (
    variant_id text NOT NULL,
    option_value_id text NOT NULL
);


ALTER TABLE public.product_variant_option OWNER TO postgres;

--
-- Name: product_variant_price_set; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_variant_price_set (
    variant_id character varying(255) NOT NULL,
    price_set_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.product_variant_price_set OWNER TO postgres;

--
-- Name: product_variant_product_image; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_variant_product_image (
    id text NOT NULL,
    variant_id text NOT NULL,
    image_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.product_variant_product_image OWNER TO postgres;

--
-- Name: promotion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.promotion (
    id text NOT NULL,
    code text NOT NULL,
    campaign_id text,
    is_automatic boolean DEFAULT false NOT NULL,
    type text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    status text DEFAULT 'draft'::text NOT NULL,
    is_tax_inclusive boolean DEFAULT false NOT NULL,
    "limit" integer,
    used integer DEFAULT 0 NOT NULL,
    metadata jsonb,
    CONSTRAINT promotion_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'active'::text, 'inactive'::text]))),
    CONSTRAINT promotion_type_check CHECK ((type = ANY (ARRAY['standard'::text, 'buyget'::text])))
);


ALTER TABLE public.promotion OWNER TO postgres;

--
-- Name: promotion_application_method; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.promotion_application_method (
    id text NOT NULL,
    value numeric,
    raw_value jsonb,
    max_quantity integer,
    apply_to_quantity integer,
    buy_rules_min_quantity integer,
    type text NOT NULL,
    target_type text NOT NULL,
    allocation text,
    promotion_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    currency_code text,
    CONSTRAINT promotion_application_method_allocation_check CHECK ((allocation = ANY (ARRAY['each'::text, 'across'::text, 'once'::text]))),
    CONSTRAINT promotion_application_method_target_type_check CHECK ((target_type = ANY (ARRAY['order'::text, 'shipping_methods'::text, 'items'::text]))),
    CONSTRAINT promotion_application_method_type_check CHECK ((type = ANY (ARRAY['fixed'::text, 'percentage'::text])))
);


ALTER TABLE public.promotion_application_method OWNER TO postgres;

--
-- Name: promotion_campaign; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.promotion_campaign (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    campaign_identifier text NOT NULL,
    starts_at timestamp with time zone,
    ends_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.promotion_campaign OWNER TO postgres;

--
-- Name: promotion_campaign_budget; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.promotion_campaign_budget (
    id text NOT NULL,
    type text NOT NULL,
    campaign_id text NOT NULL,
    "limit" numeric,
    raw_limit jsonb,
    used numeric DEFAULT 0 NOT NULL,
    raw_used jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    currency_code text,
    attribute text,
    CONSTRAINT promotion_campaign_budget_type_check CHECK ((type = ANY (ARRAY['spend'::text, 'usage'::text, 'use_by_attribute'::text, 'spend_by_attribute'::text])))
);


ALTER TABLE public.promotion_campaign_budget OWNER TO postgres;

--
-- Name: promotion_campaign_budget_usage; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.promotion_campaign_budget_usage (
    id text NOT NULL,
    attribute_value text NOT NULL,
    used numeric DEFAULT 0 NOT NULL,
    budget_id text NOT NULL,
    raw_used jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.promotion_campaign_budget_usage OWNER TO postgres;

--
-- Name: promotion_promotion_rule; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.promotion_promotion_rule (
    promotion_id text NOT NULL,
    promotion_rule_id text NOT NULL
);


ALTER TABLE public.promotion_promotion_rule OWNER TO postgres;

--
-- Name: promotion_rule; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.promotion_rule (
    id text NOT NULL,
    description text,
    attribute text NOT NULL,
    operator text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT promotion_rule_operator_check CHECK ((operator = ANY (ARRAY['gte'::text, 'lte'::text, 'gt'::text, 'lt'::text, 'eq'::text, 'ne'::text, 'in'::text])))
);


ALTER TABLE public.promotion_rule OWNER TO postgres;

--
-- Name: promotion_rule_value; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.promotion_rule_value (
    id text NOT NULL,
    promotion_rule_id text NOT NULL,
    value text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.promotion_rule_value OWNER TO postgres;

--
-- Name: provider_identity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.provider_identity (
    id text NOT NULL,
    entity_id text NOT NULL,
    provider text NOT NULL,
    auth_identity_id text NOT NULL,
    user_metadata jsonb,
    provider_metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.provider_identity OWNER TO postgres;

--
-- Name: publishable_api_key_sales_channel; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.publishable_api_key_sales_channel (
    publishable_key_id character varying(255) NOT NULL,
    sales_channel_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.publishable_api_key_sales_channel OWNER TO postgres;

--
-- Name: refund; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.refund (
    id text NOT NULL,
    amount numeric NOT NULL,
    raw_amount jsonb NOT NULL,
    payment_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    created_by text,
    metadata jsonb,
    refund_reason_id text,
    note text
);


ALTER TABLE public.refund OWNER TO postgres;

--
-- Name: refund_reason; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.refund_reason (
    id text NOT NULL,
    label text NOT NULL,
    description text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    code text NOT NULL
);


ALTER TABLE public.refund_reason OWNER TO postgres;

--
-- Name: region; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.region (
    id text NOT NULL,
    name text NOT NULL,
    currency_code text NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    automatic_taxes boolean DEFAULT true NOT NULL
);


ALTER TABLE public.region OWNER TO postgres;

--
-- Name: region_country; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.region_country (
    iso_2 text NOT NULL,
    iso_3 text NOT NULL,
    num_code text NOT NULL,
    name text NOT NULL,
    display_name text NOT NULL,
    region_id text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.region_country OWNER TO postgres;

--
-- Name: region_payment_provider; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.region_payment_provider (
    region_id character varying(255) NOT NULL,
    payment_provider_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.region_payment_provider OWNER TO postgres;

--
-- Name: reservation_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reservation_item (
    id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    line_item_id text,
    location_id text NOT NULL,
    quantity numeric NOT NULL,
    external_id text,
    description text,
    created_by text,
    metadata jsonb,
    inventory_item_id text NOT NULL,
    allow_backorder boolean DEFAULT false,
    raw_quantity jsonb
);


ALTER TABLE public.reservation_item OWNER TO postgres;

--
-- Name: return; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.return (
    id text NOT NULL,
    order_id text NOT NULL,
    claim_id text,
    exchange_id text,
    order_version integer NOT NULL,
    display_id integer NOT NULL,
    status public.return_status_enum DEFAULT 'open'::public.return_status_enum NOT NULL,
    no_notification boolean,
    refund_amount numeric,
    raw_refund_amount jsonb,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    received_at timestamp with time zone,
    canceled_at timestamp with time zone,
    location_id text,
    requested_at timestamp with time zone,
    created_by text
);


ALTER TABLE public.return OWNER TO postgres;

--
-- Name: return_display_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.return_display_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.return_display_id_seq OWNER TO postgres;

--
-- Name: return_display_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.return_display_id_seq OWNED BY public.return.display_id;


--
-- Name: return_fulfillment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.return_fulfillment (
    return_id character varying(255) NOT NULL,
    fulfillment_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.return_fulfillment OWNER TO postgres;

--
-- Name: return_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.return_item (
    id text NOT NULL,
    return_id text NOT NULL,
    reason_id text,
    item_id text NOT NULL,
    quantity numeric NOT NULL,
    raw_quantity jsonb NOT NULL,
    received_quantity numeric DEFAULT 0 NOT NULL,
    raw_received_quantity jsonb DEFAULT '{"value": "0", "precision": 20}'::jsonb NOT NULL,
    note text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    damaged_quantity numeric DEFAULT 0 NOT NULL,
    raw_damaged_quantity jsonb DEFAULT '{"value": "0", "precision": 20}'::jsonb NOT NULL
);


ALTER TABLE public.return_item OWNER TO postgres;

--
-- Name: return_reason; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.return_reason (
    id character varying NOT NULL,
    value character varying NOT NULL,
    label character varying NOT NULL,
    description character varying,
    metadata jsonb,
    parent_return_reason_id character varying,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.return_reason OWNER TO postgres;

--
-- Name: sales_channel; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sales_channel (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    is_disabled boolean DEFAULT false NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.sales_channel OWNER TO postgres;

--
-- Name: sales_channel_stock_location; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sales_channel_stock_location (
    sales_channel_id character varying(255) NOT NULL,
    stock_location_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.sales_channel_stock_location OWNER TO postgres;

--
-- Name: script_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.script_migrations (
    id integer NOT NULL,
    script_name character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    finished_at timestamp with time zone
);


ALTER TABLE public.script_migrations OWNER TO postgres;

--
-- Name: script_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.script_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.script_migrations_id_seq OWNER TO postgres;

--
-- Name: script_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.script_migrations_id_seq OWNED BY public.script_migrations.id;


--
-- Name: service_zone; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.service_zone (
    id text NOT NULL,
    name text NOT NULL,
    metadata jsonb,
    fulfillment_set_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.service_zone OWNER TO postgres;

--
-- Name: shipping_option; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shipping_option (
    id text NOT NULL,
    name text NOT NULL,
    price_type text DEFAULT 'flat'::text NOT NULL,
    service_zone_id text NOT NULL,
    shipping_profile_id text,
    provider_id text,
    data jsonb,
    metadata jsonb,
    shipping_option_type_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT shipping_option_price_type_check CHECK ((price_type = ANY (ARRAY['calculated'::text, 'flat'::text])))
);


ALTER TABLE public.shipping_option OWNER TO postgres;

--
-- Name: shipping_option_price_set; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shipping_option_price_set (
    shipping_option_id character varying(255) NOT NULL,
    price_set_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.shipping_option_price_set OWNER TO postgres;

--
-- Name: shipping_option_rule; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shipping_option_rule (
    id text NOT NULL,
    attribute text NOT NULL,
    operator text NOT NULL,
    value jsonb,
    shipping_option_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    CONSTRAINT shipping_option_rule_operator_check CHECK ((operator = ANY (ARRAY['in'::text, 'eq'::text, 'ne'::text, 'gt'::text, 'gte'::text, 'lt'::text, 'lte'::text, 'nin'::text])))
);


ALTER TABLE public.shipping_option_rule OWNER TO postgres;

--
-- Name: shipping_option_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shipping_option_type (
    id text NOT NULL,
    label text NOT NULL,
    description text,
    code text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.shipping_option_type OWNER TO postgres;

--
-- Name: shipping_profile; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shipping_profile (
    id text NOT NULL,
    name text NOT NULL,
    type text NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.shipping_profile OWNER TO postgres;

--
-- Name: stock_location; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stock_location (
    id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    name text NOT NULL,
    address_id text,
    metadata jsonb
);


ALTER TABLE public.stock_location OWNER TO postgres;

--
-- Name: stock_location_address; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stock_location_address (
    id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    address_1 text NOT NULL,
    address_2 text,
    company text,
    city text,
    country_code text NOT NULL,
    phone text,
    province text,
    postal_code text,
    metadata jsonb
);


ALTER TABLE public.stock_location_address OWNER TO postgres;

--
-- Name: store; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.store (
    id text NOT NULL,
    name text DEFAULT 'Medusa Store'::text NOT NULL,
    default_sales_channel_id text,
    default_region_id text,
    default_location_id text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.store OWNER TO postgres;

--
-- Name: store_currency; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.store_currency (
    id text NOT NULL,
    currency_code text NOT NULL,
    is_default boolean DEFAULT false NOT NULL,
    store_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.store_currency OWNER TO postgres;

--
-- Name: store_locale; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.store_locale (
    id text NOT NULL,
    locale_code text NOT NULL,
    store_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.store_locale OWNER TO postgres;

--
-- Name: tax_provider; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tax_provider (
    id text NOT NULL,
    is_enabled boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.tax_provider OWNER TO postgres;

--
-- Name: tax_rate; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tax_rate (
    id text NOT NULL,
    rate real,
    code text NOT NULL,
    name text NOT NULL,
    is_default boolean DEFAULT false NOT NULL,
    is_combinable boolean DEFAULT false NOT NULL,
    tax_region_id text NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by text,
    deleted_at timestamp with time zone
);


ALTER TABLE public.tax_rate OWNER TO postgres;

--
-- Name: tax_rate_rule; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tax_rate_rule (
    id text NOT NULL,
    tax_rate_id text NOT NULL,
    reference_id text NOT NULL,
    reference text NOT NULL,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by text,
    deleted_at timestamp with time zone
);


ALTER TABLE public.tax_rate_rule OWNER TO postgres;

--
-- Name: tax_region; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tax_region (
    id text NOT NULL,
    provider_id text,
    country_code text NOT NULL,
    province_code text,
    parent_id text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by text,
    deleted_at timestamp with time zone,
    CONSTRAINT "CK_tax_region_country_top_level" CHECK (((parent_id IS NULL) OR (province_code IS NOT NULL))),
    CONSTRAINT "CK_tax_region_provider_top_level" CHECK (((parent_id IS NULL) OR (provider_id IS NULL)))
);


ALTER TABLE public.tax_region OWNER TO postgres;

--
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    id text NOT NULL,
    first_name text,
    last_name text,
    email text NOT NULL,
    avatar_url text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- Name: user_preference; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_preference (
    id text NOT NULL,
    user_id text NOT NULL,
    key text NOT NULL,
    value jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.user_preference OWNER TO postgres;

--
-- Name: user_rbac_role; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_rbac_role (
    user_id character varying(255) NOT NULL,
    rbac_role_id character varying(255) NOT NULL,
    id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.user_rbac_role OWNER TO postgres;

--
-- Name: view_configuration; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.view_configuration (
    id text NOT NULL,
    entity text NOT NULL,
    name text,
    user_id text,
    is_system_default boolean DEFAULT false NOT NULL,
    configuration jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.view_configuration OWNER TO postgres;

--
-- Name: workflow_execution; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.workflow_execution (
    id character varying NOT NULL,
    workflow_id character varying NOT NULL,
    transaction_id character varying NOT NULL,
    execution jsonb,
    context jsonb,
    state character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone,
    retention_time integer,
    run_id text DEFAULT '01KHTF7F53CGMNCAACD6ZMMAXV'::text NOT NULL
);


ALTER TABLE public.workflow_execution OWNER TO postgres;

--
-- Name: link_module_migrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.link_module_migrations ALTER COLUMN id SET DEFAULT nextval('public.link_module_migrations_id_seq'::regclass);


--
-- Name: mikro_orm_migrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mikro_orm_migrations ALTER COLUMN id SET DEFAULT nextval('public.mikro_orm_migrations_id_seq'::regclass);


--
-- Name: order display_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."order" ALTER COLUMN display_id SET DEFAULT nextval('public.order_display_id_seq'::regclass);


--
-- Name: order_change_action ordering; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_change_action ALTER COLUMN ordering SET DEFAULT nextval('public.order_change_action_ordering_seq'::regclass);


--
-- Name: order_claim display_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_claim ALTER COLUMN display_id SET DEFAULT nextval('public.order_claim_display_id_seq'::regclass);


--
-- Name: order_exchange display_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_exchange ALTER COLUMN display_id SET DEFAULT nextval('public.order_exchange_display_id_seq'::regclass);


--
-- Name: return display_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.return ALTER COLUMN display_id SET DEFAULT nextval('public.return_display_id_seq'::regclass);


--
-- Name: script_migrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.script_migrations ALTER COLUMN id SET DEFAULT nextval('public.script_migrations_id_seq'::regclass);


--
-- Data for Name: account_holder; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.account_holder (id, provider_id, external_id, email, data, metadata, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: api_key; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.api_key (id, token, salt, redacted, title, type, last_used_at, created_by, created_at, revoked_by, revoked_at, updated_at, deleted_at) FROM stdin;
apk_01KHTF8JTBZHSMTH01M9S07V4F	pk_3b0b9722ac5371fe1e8c4285b8228403e8b503c861e320e33f79335b46d8b5b6		pk_3b0***5b6	Default Publishable API Key	publishable	\N		2026-02-19 13:41:33.067+05:30	\N	\N	2026-02-19 13:41:33.067+05:30	\N
\.


--
-- Data for Name: application_method_buy_rules; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.application_method_buy_rules (application_method_id, promotion_rule_id) FROM stdin;
\.


--
-- Data for Name: application_method_target_rules; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.application_method_target_rules (application_method_id, promotion_rule_id) FROM stdin;
\.


--
-- Data for Name: auth_identity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.auth_identity (id, app_metadata, created_at, updated_at, deleted_at) FROM stdin;
authid_01KHTHDMPKMB2DZF6875V71VEF	{"user_id": "user_01KHTHDMKRKCMMC98H0SEX0NPY"}	2026-02-19 14:19:15.987+05:30	2026-02-19 14:19:15.995+05:30	\N
authid_01KHTPY3ZM3P5RJDQVXJENQBQ2	{"customer_id": "cus_01KHTPY41MVZPW7MHG4WCR9SWP"}	2026-02-19 15:55:38.804+05:30	2026-02-19 15:55:38.88+05:30	\N
authid_01KJ4KE2T2KG4CR29KY2EWTPAN	{"user_id": "user_01KJ4KE2PY1PGV1TX2ESB213ZC"}	2026-02-23 12:06:51.907+05:30	2026-02-23 12:06:51.92+05:30	\N
authid_01KJ4KVW70WSN99WSHGHZXQR2F	{"user_id": "user_01KJ4KVW3R8RZSNH0Q3ZFVQ2R8"}	2026-02-23 12:14:23.904+05:30	2026-02-23 12:14:23.911+05:30	\N
\.


--
-- Data for Name: capture; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.capture (id, amount, raw_amount, payment_id, created_at, updated_at, deleted_at, created_by, metadata) FROM stdin;
capt_01KHX7FW68PFJHJ4GX6M4FP574	230	{"value": "230", "precision": 20}	pay_01KHTRQT7MYVXCTRGH8PRJ1J72	2026-02-20 15:23:26.728+05:30	2026-02-20 15:23:26.728+05:30	\N	\N	\N
capt_01KHX7Q8Q336E1CVF13SXKRRK5	1800	{"value": "1800", "precision": 20}	pay_01KHWZ6QNHQ82N9WJFA9TEN43M	2026-02-20 15:27:28.931+05:30	2026-02-20 15:27:28.931+05:30	\N	\N	\N
capt_01KJ010TKVEWXEC3NMXV1JGEKJ	180	{"value": "180", "precision": 20}	pay_01KJ010TK7H1ZKCJGVEBTG5DDZ	2026-02-21 17:28:05.453+05:30	2026-02-21 17:28:05.453+05:30	\N	\N	\N
\.


--
-- Data for Name: cart; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart (id, region_id, customer_id, sales_channel_id, email, currency_code, shipping_address_id, billing_address_id, metadata, created_at, updated_at, deleted_at, completed_at, locale) FROM stdin;
cart_01KHTMHET11GV1G29MPED56W8Y	reg_01KHTKFY0KFEBQMJJMD734XVS0	cus_01KHTPY41MVZPW7MHG4WCR9SWP	sc_01KHTF8JGN9HZWVEK942B6AAGQ	chetan.novarsis@gmail.com	inr	caaddr_01KHTQQ365E0R747XK1KPBY7SW	caaddr_01KHTQQ363EB5Y2EAE8KYB4Q3E	\N	2026-02-19 15:13:46.756+05:30	2026-02-19 16:09:17.192+05:30	\N	\N	\N
cart_01KHTRMH8QJQPS9T5RDARZJ2TA	reg_01KHTKFY0KFEBQMJJMD734XVS0	cus_01KHTPY41MVZPW7MHG4WCR9SWP	sc_01KHTF8JGN9HZWVEK942B6AAGQ	chetan.novarsis@gmail.com	inr	caaddr_01KHTRP7KRFJB8K686CNHSGM9Z	caaddr_01KHTRP7KREK6ZV74ATKX4FD74	\N	2026-02-19 16:25:21.885+05:30	2026-02-19 16:27:09.335+05:30	\N	2026-02-19 16:27:09.291+05:30	\N
cart_01KHWSHBX323Y2Y27070F6AYBW	reg_01KHTKFY0KFEBQMJJMD734XVS0	\N	sc_01KHTF8JGN9HZWVEK942B6AAGQ	\N	inr	caaddr_01KHWSHBX5N549XMKERX7937M6	\N	\N	2026-02-20 11:19:35.526+05:30	2026-02-20 11:19:35.526+05:30	\N	\N	\N
cart_01KHWZ4ZDV1H2VQMVDT69T1JAX	reg_01KHTKFY0KFEBQMJJMD734XVS0	cus_01KHTPY41MVZPW7MHG4WCR9SWP	sc_01KHTF8JGN9HZWVEK942B6AAGQ	chetan.novarsis@gmail.com	inr	caaddr_01KHWZ5KABCX88MK9Z7PKXSM7B	caaddr_01KHWZ5KABDJ3ZWZN581T0H4DN	\N	2026-02-20 12:57:40.987+05:30	2026-02-20 12:58:38.551+05:30	\N	2026-02-20 12:58:38.522+05:30	\N
cart_01KHWZ79TN300NH2K9VPMF1NDX	reg_01KHTKFY0KFEBQMJJMD734XVS0	cus_01KHTPY41MVZPW7MHG4WCR9SWP	sc_01KHTF8JGN9HZWVEK942B6AAGQ	chetan.novarsis@gmail.com	inr	caaddr_01KHZC81YRC5XSTCF2DEVSZ62K	caaddr_01KHZC81YRHQ0WQRC3D9Z0YW2W	\N	2026-02-20 12:58:57.174+05:30	2026-02-21 11:25:02.232+05:30	\N	\N	\N
cart_01KJ00X27TJN0NCJBRFSTM050G	reg_01KHTKFY0KFEBQMJJMD734XVS0	cus_01KHTPY41MVZPW7MHG4WCR9SWP	sc_01KHTF8JGN9HZWVEK942B6AAGQ	chetan.novarsis@gmail.com	inr	caaddr_01KJ00XKS39F0ZGW7CH3CXSSWX	caaddr_01KJ00XKS23X5M2Q6NPS0BEKR0	\N	2026-02-21 17:26:02.175+05:30	2026-02-21 17:28:04.499+05:30	\N	2026-02-21 17:28:04.458+05:30	\N
\.


--
-- Data for Name: cart_address; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_address (id, customer_id, company, first_name, last_name, address_1, address_2, city, country_code, province, postal_code, phone, metadata, created_at, updated_at, deleted_at) FROM stdin;
caaddr_01KHTMHET3TYAWEPYDAKB42C22	\N	\N	\N	\N	\N	\N	\N	in	\N	\N	\N	\N	2026-02-19 15:13:46.756+05:30	2026-02-19 15:13:46.756+05:30	\N
caaddr_01KHTQQ363EB5Y2EAE8KYB4Q3E	\N		chetan	tikkal	abcd		bihar	in	jharkhand	121212	1234567891	\N	2026-02-19 16:09:17.19+05:30	2026-02-19 16:09:17.19+05:30	\N
caaddr_01KHTQQ365E0R747XK1KPBY7SW	\N		chetan	tikkal	abcd		bihar	in	jharkhand	121212	1234567891	\N	2026-02-19 16:09:17.19+05:30	2026-02-19 16:09:17.19+05:30	\N
caaddr_01KHTRMH8TYH2N1W1M4KH3YGN4	\N	\N	\N	\N	\N	\N	\N	in	\N	\N	\N	\N	2026-02-19 16:25:21.884+05:30	2026-02-19 16:25:21.884+05:30	\N
caaddr_01KHTRP7KREK6ZV74ATKX4FD74	\N		chetan	tikkal	abcd		bihar	in	jharkhand	121212	1234567891	\N	2026-02-19 16:26:17.529+05:30	2026-02-19 16:26:17.529+05:30	\N
caaddr_01KHTRP7KRFJB8K686CNHSGM9Z	\N		chetan	tikkal	abcd		bihar	in	jharkhand	121212	1234567891	\N	2026-02-19 16:26:17.529+05:30	2026-02-19 16:26:17.529+05:30	\N
caaddr_01KHWSHBX5N549XMKERX7937M6	\N	\N	\N	\N	\N	\N	\N	in	\N	\N	\N	\N	2026-02-20 11:19:35.525+05:30	2026-02-20 11:19:35.525+05:30	\N
caaddr_01KHWZ4ZDVKJDQQ2DRDMVYNMK2	\N	\N	\N	\N	\N	\N	\N	in	\N	\N	\N	\N	2026-02-20 12:57:40.987+05:30	2026-02-20 12:57:40.987+05:30	\N
caaddr_01KHWZ5KABDJ3ZWZN581T0H4DN	\N		chetan	tikkal	abcd		bihar	in	dsads	121211		\N	2026-02-20 12:58:01.356+05:30	2026-02-20 12:58:01.356+05:30	\N
caaddr_01KHWZ5KABCX88MK9Z7PKXSM7B	\N		chetan	tikkal	abcd		bihar	in	dsads	121211		\N	2026-02-20 12:58:01.356+05:30	2026-02-20 12:58:01.356+05:30	\N
caaddr_01KHWZ79TN6AZP4BB2A2HV0QRB	\N	\N	\N	\N	\N	\N	\N	in	\N	\N	\N	\N	2026-02-20 12:58:57.174+05:30	2026-02-20 12:58:57.174+05:30	\N
caaddr_01KHXB7CJ836B0GVVQFFG4SWTJ	\N		chetan	tikkal	sdgsd	af	indore	in	mp	121212	7771454788	\N	2026-02-20 16:28:42.889+05:30	2026-02-20 16:28:42.889+05:30	\N
caaddr_01KHXB7CJ8BQB8QZR50ETZQW3C	\N		chetan	tikkal	sdgsd	af	indore	in	mp	121212	7771454788	\N	2026-02-20 16:28:42.889+05:30	2026-02-20 16:28:42.889+05:30	\N
caaddr_01KHZC06NN3H6WZHDVTKVQJFZ5	\N		chetan	tikkal	sdgsd	af	indore	in	mp	121212	7771454788	\N	2026-02-21 11:20:44.918+05:30	2026-02-21 11:20:44.918+05:30	\N
caaddr_01KHZC06NPDR842RPMQAG83687	\N		chetan	tikkal	sdgsd	af	indore	in	mp	121212	7771454788	\N	2026-02-21 11:20:44.918+05:30	2026-02-21 11:20:44.918+05:30	\N
caaddr_01KHZC3EF74JC8PZPKVW2E15RC	\N		chetan	tikkal	sdgsd	af	indore	in	mp	121212	7771454788	\N	2026-02-21 11:22:31.208+05:30	2026-02-21 11:22:31.208+05:30	\N
caaddr_01KHZC3EF7YQNPFH5Y0PRYFHNM	\N		chetan	tikkal	sdgsd	af	indore	in	mp	121212	7771454788	\N	2026-02-21 11:22:31.208+05:30	2026-02-21 11:22:31.208+05:30	\N
caaddr_01KHZC81YRHQ0WQRC3D9Z0YW2W	\N		chetan	tikkal	sdgsd	af	indore	in	mp	121212	7771454788	\N	2026-02-21 11:25:02.232+05:30	2026-02-21 11:25:02.232+05:30	\N
caaddr_01KHZC81YRC5XSTCF2DEVSZ62K	\N		chetan	tikkal	sdgsd	af	indore	in	mp	121212	7771454788	\N	2026-02-21 11:25:02.232+05:30	2026-02-21 11:25:02.232+05:30	\N
caaddr_01KJ00X27XVAGKRCWBD4572C9N	\N	\N	\N	\N	\N	\N	\N	in	\N	\N	\N	\N	2026-02-21 17:26:02.174+05:30	2026-02-21 17:26:02.174+05:30	\N
caaddr_01KJ00XKS23X5M2Q6NPS0BEKR0	\N		chetan	tikkal	sdgsd	af	indore	in	mp	121212	7771454788	\N	2026-02-21 17:26:20.131+05:30	2026-02-21 17:26:20.131+05:30	\N
caaddr_01KJ00XKS39F0ZGW7CH3CXSSWX	\N		chetan	tikkal	sdgsd	af	indore	in	mp	121212	7771454788	\N	2026-02-21 17:26:20.131+05:30	2026-02-21 17:26:20.131+05:30	\N
\.


--
-- Data for Name: cart_line_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_line_item (id, cart_id, title, subtitle, thumbnail, quantity, variant_id, product_id, product_title, product_description, product_subtitle, product_type, product_collection, product_handle, variant_sku, variant_barcode, variant_title, variant_option_values, requires_shipping, is_discountable, is_tax_inclusive, compare_at_unit_price, raw_compare_at_unit_price, unit_price, raw_unit_price, metadata, created_at, updated_at, deleted_at, product_type_id, is_custom_price, is_giftcard) FROM stdin;
cali_01KHTMHF3B5ZQFV86Z5N0NSV8T	cart_01KHTMHET11GV1G29MPED56W8Y	Whole Wheat Atta	1 Pack	https://placehold.co/600x400?text=Whole%20Wheat%20Atta	1	variant_01KHTKFYC0TFX6FNR1E81DGQZP	prod_01KHTKFY8VS3ECJSEKB0B0BXCH	Whole Wheat Atta	Pure Whole Wheat Atta	\N	\N	\N	whole-wheat-atta	WHEAT-ATTA-1	\N	1 Pack	\N	t	t	f	\N	\N	150	{"value": "150", "precision": 20}	{}	2026-02-19 15:13:47.051+05:30	2026-02-19 15:59:19.354+05:30	2026-02-19 15:59:19.352+05:30	\N	f	f
cali_01KHTQ4RAD6V9RV0CDS2DE37F3	cart_01KHTMHET11GV1G29MPED56W8Y	Multigrain Atta	1 Pack	http://localhost:9000/static/1771496164792-image-1771495656335.png	1	variant_01KHTKFYBZ5CC78V7V83N6PEYA	prod_01KHTKFY8VDC4G7YD60DP3RVC1	Multigrain Atta	Healthy Multigrain Atta	\N	\N	\N	multigrain-atta	MULTI-ATTA-1	\N	1 Pack	\N	t	t	f	\N	\N	180	{"value": "180", "precision": 20}	{}	2026-02-19 15:59:16.237+05:30	2026-02-19 16:11:59.757+05:30	2026-02-19 16:11:59.756+05:30	\N	f	f
cali_01KHTQW6QZF4C5W2RCXA8NYT7B	cart_01KHTMHET11GV1G29MPED56W8Y	Multigrain Atta	1 Pack	http://localhost:9000/static/1771496164792-image-1771495656335.png	1	variant_01KHTKFYBZ5CC78V7V83N6PEYA	prod_01KHTKFY8VDC4G7YD60DP3RVC1	Multigrain Atta	Healthy Multigrain Atta	\N	\N	\N	multigrain-atta	MULTI-ATTA-1	\N	1 Pack	\N	t	t	f	\N	\N	180	{"value": "180", "precision": 20}	{}	2026-02-19 16:12:04.671+05:30	2026-02-19 16:12:04.671+05:30	\N	\N	f	f
cali_01KHTRMHK1GBBM1ZG4TRH81KQV	cart_01KHTRMH8QJQPS9T5RDARZJ2TA	Multigrain Atta	1 Pack	http://localhost:9000/static/1771496164792-image-1771495656335.png	1	variant_01KHTKFYBZ5CC78V7V83N6PEYA	prod_01KHTKFY8VDC4G7YD60DP3RVC1	Multigrain Atta	Healthy Multigrain Atta	\N	\N	\N	multigrain-atta	MULTI-ATTA-1	\N	1 Pack	\N	t	t	f	\N	\N	180	{"value": "180", "precision": 20}	{}	2026-02-19 16:25:22.209+05:30	2026-02-19 16:25:22.209+05:30	\N	\N	f	f
cali_01KHWSHC85W3JBPAEZD0YGRVVJ	cart_01KHWSHBX323Y2Y27070F6AYBW	Moringa Sattu	500g	http://localhost:9000/static/1771566477341-image-1771563420177.png	1	variant_01KHTKFYC017FK45D5EW04GD9Y	prod_01KHTKFY8WT4SCZ4AMAKQ4F16M	Moringa Sattu	Moringa Sattu 500g Pack	\N	\N	\N	moringa-sattu	MORINGA-SATTU-500	\N	500g	\N	t	t	f	\N	\N	220	{"value": "220", "precision": 20}	{}	2026-02-20 11:19:35.877+05:30	2026-02-20 11:22:41.039+05:30	2026-02-20 11:22:41.038+05:30	\N	f	f
cali_01KHWSQ1T71J5V9RZ965C1NRSV	cart_01KHWSHBX323Y2Y27070F6AYBW	Moong Multigrain Atta	500g	http://localhost:9000/static/1771565714464-image-1771565128461.png	1	variant_01KHWRQ33GRK9DVKN84QVS62GF	prod_01KHWRQ31J9VGVRDJ4STXTZW2D	Moong Multigrain Atta	Healthy Moong Multigrain Atta		\N	\N	moong-multigrain-atta	moong-500	\N	500g	\N	t	t	f	\N	\N	180	{"value": "180", "precision": 20}	{}	2026-02-20 11:22:41.799+05:30	2026-02-20 11:22:41.799+05:30	\N	\N	f	f
cali_01KHWZ4ZQRMFK4EK68STXJGR87	cart_01KHWZ4ZDV1H2VQMVDT69T1JAX	Ghee	500g Bottle	http://localhost:9000/static/1771569404776-image-1771569324022.png	1	variant_01KHTKFYC1T7GYJAPEK3GBX2HY	prod_01KHTKFY8WJSF8SQ05MV2PS7J8	Ghee	Pure Ghee 500g Bottle	\N	\N	\N	ghee-500	GHEE-500	\N	500g Bottle	\N	t	t	f	\N	\N	1800	{"value": "1800", "precision": 20}	{}	2026-02-20 12:57:41.304+05:30	2026-02-20 12:57:41.304+05:30	\N	\N	f	f
cali_01KHWZ7A5RY36VY2BAC806Z4FJ	cart_01KHWZ79TN300NH2K9VPMF1NDX	Ghee	500g Bottle	http://localhost:9000/static/1771569404776-image-1771569324022.png	1	variant_01KHTKFYC1T7GYJAPEK3GBX2HY	prod_01KHTKFY8WJSF8SQ05MV2PS7J8	Ghee	Pure Ghee 500g Bottle	\N	\N	\N	ghee-500	GHEE-500	\N	500g Bottle	\N	t	t	f	\N	\N	1800	{"value": "1800", "precision": 20}	{}	2026-02-20 12:58:57.528+05:30	2026-02-20 12:58:57.528+05:30	\N	\N	f	f
cali_01KHX1K8C4MHZA252P3VC00V1V	cart_01KHWSHBX323Y2Y27070F6AYBW	Multigrain Atta	1 Pack	http://localhost:9000/static/1771496164803-image-1771495992704.png	1	variant_01KHTKFYBZ5CC78V7V83N6PEYA	prod_01KHTKFY8VDC4G7YD60DP3RVC1	Multigrain Atta	Healthy Multigrain Atta	\N	\N	\N	multigrain-atta	MULTI-ATTA-1	\N	1 Pack	\N	t	t	f	\N	\N	180	{"value": "180", "precision": 20}	{}	2026-02-20 13:40:26.052+05:30	2026-02-20 13:40:26.052+05:30	\N	\N	f	f
cali_01KHX1Q4MP62RNH3AGWVADEVQT	cart_01KHWSHBX323Y2Y27070F6AYBW	Ghee	500g Bottle	http://localhost:9000/static/1771569404776-image-1771569324022.png	1	variant_01KHTKFYC1T7GYJAPEK3GBX2HY	prod_01KHTKFY8WJSF8SQ05MV2PS7J8	Ghee	Pure Ghee 500g Bottle	\N	\N	\N	ghee-500	GHEE-500	\N	500g Bottle	\N	t	t	f	\N	\N	1800	{"value": "1800", "precision": 20}	{}	2026-02-20 13:42:33.303+05:30	2026-02-20 13:42:33.303+05:30	\N	\N	f	f
cali_01KJ00X2K4YD541FX5C4TENG5A	cart_01KJ00X27TJN0NCJBRFSTM050G	Multigrain Atta	1 Pack	http://localhost:9000/static/1771496164803-image-1771495992704.png	1	variant_01KHTKFYBZ5CC78V7V83N6PEYA	prod_01KHTKFY8VDC4G7YD60DP3RVC1	Multigrain Atta	Healthy Multigrain Atta	\N	\N	\N	multigrain-atta	MULTI-ATTA-1	\N	1 Pack	\N	t	t	f	\N	\N	180	{"value": "180", "precision": 20}	{}	2026-02-21 17:26:02.533+05:30	2026-02-21 17:26:02.533+05:30	\N	\N	f	f
\.


--
-- Data for Name: cart_line_item_adjustment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_line_item_adjustment (id, description, promotion_id, code, amount, raw_amount, provider_id, metadata, created_at, updated_at, deleted_at, item_id, is_tax_inclusive) FROM stdin;
\.


--
-- Data for Name: cart_line_item_tax_line; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_line_item_tax_line (id, description, tax_rate_id, code, rate, provider_id, metadata, created_at, updated_at, deleted_at, item_id) FROM stdin;
\.


--
-- Data for Name: cart_payment_collection; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_payment_collection (cart_id, payment_collection_id, id, created_at, updated_at, deleted_at) FROM stdin;
cart_01KHTRMH8QJQPS9T5RDARZJ2TA	pay_col_01KHTRPDGYYS87T627E490057T	capaycol_01KHTRPDH6HPC5D7PVERKTPE8E	2026-02-19 16:26:23.59034+05:30	2026-02-19 16:26:23.59034+05:30	\N
cart_01KHWZ4ZDV1H2VQMVDT69T1JAX	pay_col_01KHWZ5SBEMSAMSJ80RKPRAF1Z	capaycol_01KHWZ5SBN6NF1T6NBEY8GZR07	2026-02-20 12:58:07.541059+05:30	2026-02-20 12:58:07.541059+05:30	\N
cart_01KHWZ79TN300NH2K9VPMF1NDX	pay_col_01KHZAA5PK8S313TZR7K98YVD7	capaycol_01KHZAA5PVQRH7XXF5J4H6YE6B	2026-02-21 10:51:14.458616+05:30	2026-02-21 10:51:14.458616+05:30	\N
cart_01KJ00X27TJN0NCJBRFSTM050G	pay_col_01KJ00XTHEGSB1RBX6SA1HK8FT	capaycol_01KJ00XTHRYPJJ18DWX0C046WT	2026-02-21 17:26:27.063787+05:30	2026-02-21 17:26:27.063787+05:30	\N
\.


--
-- Data for Name: cart_promotion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_promotion (cart_id, promotion_id, id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: cart_shipping_method; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_shipping_method (id, cart_id, name, description, amount, raw_amount, is_tax_inclusive, shipping_option_id, data, metadata, created_at, updated_at, deleted_at) FROM stdin;
casm_01KHTQQ78ZQAHG2Q9X52GSDXC5	cart_01KHTMHET11GV1G29MPED56W8Y	Standard Shipping	\N	50	{"value": "50", "precision": 20}	f	so_01KHTKFY58XNN3M9WYSRN52W9P	{}	\N	2026-02-19 16:09:21.376+05:30	2026-02-19 16:09:21.376+05:30	\N
casm_01KHTRPAEY14VARXJJRH2W8RK0	cart_01KHTRMH8QJQPS9T5RDARZJ2TA	Standard Shipping	\N	50	{"value": "50", "precision": 20}	f	so_01KHTKFY58XNN3M9WYSRN52W9P	{}	\N	2026-02-19 16:26:20.447+05:30	2026-02-19 16:26:20.447+05:30	\N
casm_01KHWZ5P96V6VG4VDW4KSGHZNP	cart_01KHWZ4ZDV1H2VQMVDT69T1JAX	Standard Shipping	\N	0	{"value": "0", "precision": 20}	f	so_01KHTKFY58XNN3M9WYSRN52W9P	{}	\N	2026-02-20 12:58:04.391+05:30	2026-02-20 12:58:04.391+05:30	\N
casm_01KHZA14KYRR6JDG48NEND4X64	cart_01KHWZ79TN300NH2K9VPMF1NDX	Standard Shipping	\N	0	{"value": "0", "precision": 20}	f	so_01KHTKFY58XNN3M9WYSRN52W9P	{}	\N	2026-02-21 10:46:18.431+05:30	2026-02-21 10:46:18.431+05:30	\N
casm_01KJ00XPS2C9PT00WYYPYZV86X	cart_01KJ00X27TJN0NCJBRFSTM050G	Standard Shipping	\N	0	{"value": "0", "precision": 20}	f	so_01KHTKFY58XNN3M9WYSRN52W9P	{}	\N	2026-02-21 17:26:23.205+05:30	2026-02-21 17:26:23.205+05:30	\N
\.


--
-- Data for Name: cart_shipping_method_adjustment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_shipping_method_adjustment (id, description, promotion_id, code, amount, raw_amount, provider_id, metadata, created_at, updated_at, deleted_at, shipping_method_id) FROM stdin;
\.


--
-- Data for Name: cart_shipping_method_tax_line; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_shipping_method_tax_line (id, description, tax_rate_id, code, rate, provider_id, metadata, created_at, updated_at, deleted_at, shipping_method_id) FROM stdin;
\.


--
-- Data for Name: credit_line; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.credit_line (id, cart_id, reference, reference_id, amount, raw_amount, metadata, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: currency; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.currency (code, symbol, symbol_native, decimal_digits, rounding, raw_rounding, name, created_at, updated_at, deleted_at) FROM stdin;
usd	$	$	2	0	{"value": "0", "precision": 20}	US Dollar	2026-02-19 13:41:02.458+05:30	2026-02-19 13:41:02.458+05:30	\N
cad	CA$	$	2	0	{"value": "0", "precision": 20}	Canadian Dollar	2026-02-19 13:41:02.459+05:30	2026-02-19 13:41:02.459+05:30	\N
eur	€	€	2	0	{"value": "0", "precision": 20}	Euro	2026-02-19 13:41:02.459+05:30	2026-02-19 13:41:02.459+05:30	\N
aed	AED	د.إ.‏	2	0	{"value": "0", "precision": 20}	United Arab Emirates Dirham	2026-02-19 13:41:02.459+05:30	2026-02-19 13:41:02.459+05:30	\N
afn	Af	؋	0	0	{"value": "0", "precision": 20}	Afghan Afghani	2026-02-19 13:41:02.459+05:30	2026-02-19 13:41:02.459+05:30	\N
all	ALL	Lek	0	0	{"value": "0", "precision": 20}	Albanian Lek	2026-02-19 13:41:02.459+05:30	2026-02-19 13:41:02.459+05:30	\N
amd	AMD	դր.	0	0	{"value": "0", "precision": 20}	Armenian Dram	2026-02-19 13:41:02.459+05:30	2026-02-19 13:41:02.459+05:30	\N
ars	AR$	$	2	0	{"value": "0", "precision": 20}	Argentine Peso	2026-02-19 13:41:02.459+05:30	2026-02-19 13:41:02.459+05:30	\N
aud	AU$	$	2	0	{"value": "0", "precision": 20}	Australian Dollar	2026-02-19 13:41:02.459+05:30	2026-02-19 13:41:02.459+05:30	\N
azn	man.	ман.	2	0	{"value": "0", "precision": 20}	Azerbaijani Manat	2026-02-19 13:41:02.459+05:30	2026-02-19 13:41:02.459+05:30	\N
bam	KM	KM	2	0	{"value": "0", "precision": 20}	Bosnia-Herzegovina Convertible Mark	2026-02-19 13:41:02.459+05:30	2026-02-19 13:41:02.459+05:30	\N
bdt	Tk	৳	2	0	{"value": "0", "precision": 20}	Bangladeshi Taka	2026-02-19 13:41:02.459+05:30	2026-02-19 13:41:02.459+05:30	\N
bgn	BGN	лв.	2	0	{"value": "0", "precision": 20}	Bulgarian Lev	2026-02-19 13:41:02.459+05:30	2026-02-19 13:41:02.459+05:30	\N
bhd	BD	د.ب.‏	3	0	{"value": "0", "precision": 20}	Bahraini Dinar	2026-02-19 13:41:02.459+05:30	2026-02-19 13:41:02.459+05:30	\N
bif	FBu	FBu	0	0	{"value": "0", "precision": 20}	Burundian Franc	2026-02-19 13:41:02.459+05:30	2026-02-19 13:41:02.459+05:30	\N
bnd	BN$	$	2	0	{"value": "0", "precision": 20}	Brunei Dollar	2026-02-19 13:41:02.459+05:30	2026-02-19 13:41:02.459+05:30	\N
bob	Bs	Bs	2	0	{"value": "0", "precision": 20}	Bolivian Boliviano	2026-02-19 13:41:02.459+05:30	2026-02-19 13:41:02.459+05:30	\N
brl	R$	R$	2	0	{"value": "0", "precision": 20}	Brazilian Real	2026-02-19 13:41:02.459+05:30	2026-02-19 13:41:02.459+05:30	\N
bwp	BWP	P	2	0	{"value": "0", "precision": 20}	Botswanan Pula	2026-02-19 13:41:02.459+05:30	2026-02-19 13:41:02.459+05:30	\N
byn	Br	руб.	2	0	{"value": "0", "precision": 20}	Belarusian Ruble	2026-02-19 13:41:02.459+05:30	2026-02-19 13:41:02.459+05:30	\N
bzd	BZ$	$	2	0	{"value": "0", "precision": 20}	Belize Dollar	2026-02-19 13:41:02.459+05:30	2026-02-19 13:41:02.459+05:30	\N
cdf	CDF	FrCD	2	0	{"value": "0", "precision": 20}	Congolese Franc	2026-02-19 13:41:02.459+05:30	2026-02-19 13:41:02.459+05:30	\N
chf	CHF	CHF	2	0.05	{"value": "0.05", "precision": 20}	Swiss Franc	2026-02-19 13:41:02.459+05:30	2026-02-19 13:41:02.459+05:30	\N
clp	CL$	$	0	0	{"value": "0", "precision": 20}	Chilean Peso	2026-02-19 13:41:02.459+05:30	2026-02-19 13:41:02.459+05:30	\N
cny	CN¥	CN¥	2	0	{"value": "0", "precision": 20}	Chinese Yuan	2026-02-19 13:41:02.459+05:30	2026-02-19 13:41:02.459+05:30	\N
cop	CO$	$	0	0	{"value": "0", "precision": 20}	Colombian Peso	2026-02-19 13:41:02.459+05:30	2026-02-19 13:41:02.459+05:30	\N
crc	₡	₡	0	0	{"value": "0", "precision": 20}	Costa Rican Colón	2026-02-19 13:41:02.459+05:30	2026-02-19 13:41:02.459+05:30	\N
cve	CV$	CV$	2	0	{"value": "0", "precision": 20}	Cape Verdean Escudo	2026-02-19 13:41:02.459+05:30	2026-02-19 13:41:02.459+05:30	\N
czk	Kč	Kč	2	0	{"value": "0", "precision": 20}	Czech Republic Koruna	2026-02-19 13:41:02.459+05:30	2026-02-19 13:41:02.459+05:30	\N
djf	Fdj	Fdj	0	0	{"value": "0", "precision": 20}	Djiboutian Franc	2026-02-19 13:41:02.459+05:30	2026-02-19 13:41:02.459+05:30	\N
dkk	Dkr	kr	2	0	{"value": "0", "precision": 20}	Danish Krone	2026-02-19 13:41:02.459+05:30	2026-02-19 13:41:02.459+05:30	\N
dop	RD$	RD$	2	0	{"value": "0", "precision": 20}	Dominican Peso	2026-02-19 13:41:02.459+05:30	2026-02-19 13:41:02.459+05:30	\N
dzd	DA	د.ج.‏	2	0	{"value": "0", "precision": 20}	Algerian Dinar	2026-02-19 13:41:02.46+05:30	2026-02-19 13:41:02.46+05:30	\N
eek	Ekr	kr	2	0	{"value": "0", "precision": 20}	Estonian Kroon	2026-02-19 13:41:02.46+05:30	2026-02-19 13:41:02.46+05:30	\N
egp	EGP	ج.م.‏	2	0	{"value": "0", "precision": 20}	Egyptian Pound	2026-02-19 13:41:02.46+05:30	2026-02-19 13:41:02.46+05:30	\N
ern	Nfk	Nfk	2	0	{"value": "0", "precision": 20}	Eritrean Nakfa	2026-02-19 13:41:02.46+05:30	2026-02-19 13:41:02.46+05:30	\N
etb	Br	Br	2	0	{"value": "0", "precision": 20}	Ethiopian Birr	2026-02-19 13:41:02.46+05:30	2026-02-19 13:41:02.46+05:30	\N
gbp	£	£	2	0	{"value": "0", "precision": 20}	British Pound Sterling	2026-02-19 13:41:02.46+05:30	2026-02-19 13:41:02.46+05:30	\N
gel	GEL	GEL	2	0	{"value": "0", "precision": 20}	Georgian Lari	2026-02-19 13:41:02.46+05:30	2026-02-19 13:41:02.46+05:30	\N
ghs	GH₵	GH₵	2	0	{"value": "0", "precision": 20}	Ghanaian Cedi	2026-02-19 13:41:02.46+05:30	2026-02-19 13:41:02.46+05:30	\N
gnf	FG	FG	0	0	{"value": "0", "precision": 20}	Guinean Franc	2026-02-19 13:41:02.46+05:30	2026-02-19 13:41:02.46+05:30	\N
gtq	GTQ	Q	2	0	{"value": "0", "precision": 20}	Guatemalan Quetzal	2026-02-19 13:41:02.46+05:30	2026-02-19 13:41:02.46+05:30	\N
hkd	HK$	$	2	0	{"value": "0", "precision": 20}	Hong Kong Dollar	2026-02-19 13:41:02.46+05:30	2026-02-19 13:41:02.46+05:30	\N
hnl	HNL	L	2	0	{"value": "0", "precision": 20}	Honduran Lempira	2026-02-19 13:41:02.46+05:30	2026-02-19 13:41:02.46+05:30	\N
hrk	kn	kn	2	0	{"value": "0", "precision": 20}	Croatian Kuna	2026-02-19 13:41:02.46+05:30	2026-02-19 13:41:02.46+05:30	\N
huf	Ft	Ft	0	0	{"value": "0", "precision": 20}	Hungarian Forint	2026-02-19 13:41:02.46+05:30	2026-02-19 13:41:02.46+05:30	\N
idr	Rp	Rp	0	0	{"value": "0", "precision": 20}	Indonesian Rupiah	2026-02-19 13:41:02.46+05:30	2026-02-19 13:41:02.46+05:30	\N
ils	₪	₪	2	0	{"value": "0", "precision": 20}	Israeli New Sheqel	2026-02-19 13:41:02.46+05:30	2026-02-19 13:41:02.46+05:30	\N
inr	Rs	₹	2	0	{"value": "0", "precision": 20}	Indian Rupee	2026-02-19 13:41:02.46+05:30	2026-02-19 13:41:02.46+05:30	\N
iqd	IQD	د.ع.‏	0	0	{"value": "0", "precision": 20}	Iraqi Dinar	2026-02-19 13:41:02.46+05:30	2026-02-19 13:41:02.46+05:30	\N
irr	IRR	﷼	0	0	{"value": "0", "precision": 20}	Iranian Rial	2026-02-19 13:41:02.46+05:30	2026-02-19 13:41:02.46+05:30	\N
isk	Ikr	kr	0	0	{"value": "0", "precision": 20}	Icelandic Króna	2026-02-19 13:41:02.46+05:30	2026-02-19 13:41:02.46+05:30	\N
jmd	J$	$	2	0	{"value": "0", "precision": 20}	Jamaican Dollar	2026-02-19 13:41:02.46+05:30	2026-02-19 13:41:02.46+05:30	\N
jod	JD	د.أ.‏	3	0	{"value": "0", "precision": 20}	Jordanian Dinar	2026-02-19 13:41:02.46+05:30	2026-02-19 13:41:02.46+05:30	\N
jpy	¥	￥	0	0	{"value": "0", "precision": 20}	Japanese Yen	2026-02-19 13:41:02.46+05:30	2026-02-19 13:41:02.46+05:30	\N
kes	Ksh	Ksh	2	0	{"value": "0", "precision": 20}	Kenyan Shilling	2026-02-19 13:41:02.46+05:30	2026-02-19 13:41:02.46+05:30	\N
khr	KHR	៛	2	0	{"value": "0", "precision": 20}	Cambodian Riel	2026-02-19 13:41:02.46+05:30	2026-02-19 13:41:02.46+05:30	\N
kmf	CF	FC	0	0	{"value": "0", "precision": 20}	Comorian Franc	2026-02-19 13:41:02.46+05:30	2026-02-19 13:41:02.46+05:30	\N
krw	₩	₩	0	0	{"value": "0", "precision": 20}	South Korean Won	2026-02-19 13:41:02.46+05:30	2026-02-19 13:41:02.46+05:30	\N
kwd	KD	د.ك.‏	3	0	{"value": "0", "precision": 20}	Kuwaiti Dinar	2026-02-19 13:41:02.46+05:30	2026-02-19 13:41:02.46+05:30	\N
kzt	KZT	тңг.	2	0	{"value": "0", "precision": 20}	Kazakhstani Tenge	2026-02-19 13:41:02.46+05:30	2026-02-19 13:41:02.46+05:30	\N
lbp	LB£	ل.ل.‏	0	0	{"value": "0", "precision": 20}	Lebanese Pound	2026-02-19 13:41:02.46+05:30	2026-02-19 13:41:02.46+05:30	\N
lkr	SLRs	SL Re	2	0	{"value": "0", "precision": 20}	Sri Lankan Rupee	2026-02-19 13:41:02.46+05:30	2026-02-19 13:41:02.46+05:30	\N
ltl	Lt	Lt	2	0	{"value": "0", "precision": 20}	Lithuanian Litas	2026-02-19 13:41:02.46+05:30	2026-02-19 13:41:02.46+05:30	\N
lvl	Ls	Ls	2	0	{"value": "0", "precision": 20}	Latvian Lats	2026-02-19 13:41:02.46+05:30	2026-02-19 13:41:02.46+05:30	\N
lyd	LD	د.ل.‏	3	0	{"value": "0", "precision": 20}	Libyan Dinar	2026-02-19 13:41:02.46+05:30	2026-02-19 13:41:02.46+05:30	\N
mad	MAD	د.م.‏	2	0	{"value": "0", "precision": 20}	Moroccan Dirham	2026-02-19 13:41:02.46+05:30	2026-02-19 13:41:02.46+05:30	\N
mdl	MDL	MDL	2	0	{"value": "0", "precision": 20}	Moldovan Leu	2026-02-19 13:41:02.46+05:30	2026-02-19 13:41:02.46+05:30	\N
mga	MGA	MGA	0	0	{"value": "0", "precision": 20}	Malagasy Ariary	2026-02-19 13:41:02.46+05:30	2026-02-19 13:41:02.46+05:30	\N
mkd	MKD	MKD	2	0	{"value": "0", "precision": 20}	Macedonian Denar	2026-02-19 13:41:02.46+05:30	2026-02-19 13:41:02.46+05:30	\N
mmk	MMK	K	0	0	{"value": "0", "precision": 20}	Myanma Kyat	2026-02-19 13:41:02.46+05:30	2026-02-19 13:41:02.46+05:30	\N
mnt	MNT	₮	0	0	{"value": "0", "precision": 20}	Mongolian Tugrig	2026-02-19 13:41:02.46+05:30	2026-02-19 13:41:02.46+05:30	\N
mop	MOP$	MOP$	2	0	{"value": "0", "precision": 20}	Macanese Pataca	2026-02-19 13:41:02.46+05:30	2026-02-19 13:41:02.46+05:30	\N
mur	MURs	MURs	0	0	{"value": "0", "precision": 20}	Mauritian Rupee	2026-02-19 13:41:02.46+05:30	2026-02-19 13:41:02.46+05:30	\N
mwk	K	K	2	0	{"value": "0", "precision": 20}	Malawian Kwacha	2026-02-19 13:41:02.46+05:30	2026-02-19 13:41:02.46+05:30	\N
mxn	MX$	$	2	0	{"value": "0", "precision": 20}	Mexican Peso	2026-02-19 13:41:02.46+05:30	2026-02-19 13:41:02.46+05:30	\N
myr	RM	RM	2	0	{"value": "0", "precision": 20}	Malaysian Ringgit	2026-02-19 13:41:02.46+05:30	2026-02-19 13:41:02.46+05:30	\N
mzn	MTn	MTn	2	0	{"value": "0", "precision": 20}	Mozambican Metical	2026-02-19 13:41:02.46+05:30	2026-02-19 13:41:02.46+05:30	\N
nad	N$	N$	2	0	{"value": "0", "precision": 20}	Namibian Dollar	2026-02-19 13:41:02.46+05:30	2026-02-19 13:41:02.46+05:30	\N
ngn	₦	₦	2	0	{"value": "0", "precision": 20}	Nigerian Naira	2026-02-19 13:41:02.46+05:30	2026-02-19 13:41:02.46+05:30	\N
nio	C$	C$	2	0	{"value": "0", "precision": 20}	Nicaraguan Córdoba	2026-02-19 13:41:02.461+05:30	2026-02-19 13:41:02.461+05:30	\N
nok	Nkr	kr	2	0	{"value": "0", "precision": 20}	Norwegian Krone	2026-02-19 13:41:02.461+05:30	2026-02-19 13:41:02.461+05:30	\N
npr	NPRs	नेरू	2	0	{"value": "0", "precision": 20}	Nepalese Rupee	2026-02-19 13:41:02.461+05:30	2026-02-19 13:41:02.461+05:30	\N
nzd	NZ$	$	2	0	{"value": "0", "precision": 20}	New Zealand Dollar	2026-02-19 13:41:02.461+05:30	2026-02-19 13:41:02.461+05:30	\N
omr	OMR	ر.ع.‏	3	0	{"value": "0", "precision": 20}	Omani Rial	2026-02-19 13:41:02.461+05:30	2026-02-19 13:41:02.461+05:30	\N
pab	B/.	B/.	2	0	{"value": "0", "precision": 20}	Panamanian Balboa	2026-02-19 13:41:02.461+05:30	2026-02-19 13:41:02.461+05:30	\N
pen	S/.	S/.	2	0	{"value": "0", "precision": 20}	Peruvian Nuevo Sol	2026-02-19 13:41:02.461+05:30	2026-02-19 13:41:02.461+05:30	\N
php	₱	₱	2	0	{"value": "0", "precision": 20}	Philippine Peso	2026-02-19 13:41:02.461+05:30	2026-02-19 13:41:02.461+05:30	\N
pkr	PKRs	₨	0	0	{"value": "0", "precision": 20}	Pakistani Rupee	2026-02-19 13:41:02.461+05:30	2026-02-19 13:41:02.461+05:30	\N
pln	zł	zł	2	0	{"value": "0", "precision": 20}	Polish Zloty	2026-02-19 13:41:02.461+05:30	2026-02-19 13:41:02.461+05:30	\N
pyg	₲	₲	0	0	{"value": "0", "precision": 20}	Paraguayan Guarani	2026-02-19 13:41:02.461+05:30	2026-02-19 13:41:02.461+05:30	\N
qar	QR	ر.ق.‏	2	0	{"value": "0", "precision": 20}	Qatari Rial	2026-02-19 13:41:02.461+05:30	2026-02-19 13:41:02.461+05:30	\N
ron	RON	RON	2	0	{"value": "0", "precision": 20}	Romanian Leu	2026-02-19 13:41:02.461+05:30	2026-02-19 13:41:02.461+05:30	\N
rsd	din.	дин.	0	0	{"value": "0", "precision": 20}	Serbian Dinar	2026-02-19 13:41:02.461+05:30	2026-02-19 13:41:02.461+05:30	\N
rub	RUB	₽.	2	0	{"value": "0", "precision": 20}	Russian Ruble	2026-02-19 13:41:02.461+05:30	2026-02-19 13:41:02.461+05:30	\N
rwf	RWF	FR	0	0	{"value": "0", "precision": 20}	Rwandan Franc	2026-02-19 13:41:02.461+05:30	2026-02-19 13:41:02.461+05:30	\N
sar	SR	ر.س.‏	2	0	{"value": "0", "precision": 20}	Saudi Riyal	2026-02-19 13:41:02.461+05:30	2026-02-19 13:41:02.461+05:30	\N
sdg	SDG	SDG	2	0	{"value": "0", "precision": 20}	Sudanese Pound	2026-02-19 13:41:02.461+05:30	2026-02-19 13:41:02.461+05:30	\N
sek	Skr	kr	2	0	{"value": "0", "precision": 20}	Swedish Krona	2026-02-19 13:41:02.461+05:30	2026-02-19 13:41:02.461+05:30	\N
sgd	S$	$	2	0	{"value": "0", "precision": 20}	Singapore Dollar	2026-02-19 13:41:02.461+05:30	2026-02-19 13:41:02.461+05:30	\N
sos	Ssh	Ssh	0	0	{"value": "0", "precision": 20}	Somali Shilling	2026-02-19 13:41:02.461+05:30	2026-02-19 13:41:02.461+05:30	\N
syp	SY£	ل.س.‏	0	0	{"value": "0", "precision": 20}	Syrian Pound	2026-02-19 13:41:02.461+05:30	2026-02-19 13:41:02.461+05:30	\N
thb	฿	฿	2	0	{"value": "0", "precision": 20}	Thai Baht	2026-02-19 13:41:02.461+05:30	2026-02-19 13:41:02.461+05:30	\N
tnd	DT	د.ت.‏	3	0	{"value": "0", "precision": 20}	Tunisian Dinar	2026-02-19 13:41:02.461+05:30	2026-02-19 13:41:02.461+05:30	\N
top	T$	T$	2	0	{"value": "0", "precision": 20}	Tongan Paʻanga	2026-02-19 13:41:02.461+05:30	2026-02-19 13:41:02.461+05:30	\N
tjs	TJS	с.	2	0	{"value": "0", "precision": 20}	Tajikistani Somoni	2026-02-19 13:41:02.461+05:30	2026-02-19 13:41:02.461+05:30	\N
try	₺	₺	2	0	{"value": "0", "precision": 20}	Turkish Lira	2026-02-19 13:41:02.461+05:30	2026-02-19 13:41:02.461+05:30	\N
ttd	TT$	$	2	0	{"value": "0", "precision": 20}	Trinidad and Tobago Dollar	2026-02-19 13:41:02.461+05:30	2026-02-19 13:41:02.461+05:30	\N
twd	NT$	NT$	2	0	{"value": "0", "precision": 20}	New Taiwan Dollar	2026-02-19 13:41:02.461+05:30	2026-02-19 13:41:02.461+05:30	\N
tzs	TSh	TSh	0	0	{"value": "0", "precision": 20}	Tanzanian Shilling	2026-02-19 13:41:02.461+05:30	2026-02-19 13:41:02.461+05:30	\N
uah	₴	₴	2	0	{"value": "0", "precision": 20}	Ukrainian Hryvnia	2026-02-19 13:41:02.461+05:30	2026-02-19 13:41:02.461+05:30	\N
ugx	USh	USh	0	0	{"value": "0", "precision": 20}	Ugandan Shilling	2026-02-19 13:41:02.461+05:30	2026-02-19 13:41:02.461+05:30	\N
uyu	$U	$	2	0	{"value": "0", "precision": 20}	Uruguayan Peso	2026-02-19 13:41:02.461+05:30	2026-02-19 13:41:02.461+05:30	\N
uzs	UZS	UZS	0	0	{"value": "0", "precision": 20}	Uzbekistan Som	2026-02-19 13:41:02.461+05:30	2026-02-19 13:41:02.461+05:30	\N
vef	Bs.F.	Bs.F.	2	0	{"value": "0", "precision": 20}	Venezuelan Bolívar	2026-02-19 13:41:02.461+05:30	2026-02-19 13:41:02.461+05:30	\N
vnd	₫	₫	0	0	{"value": "0", "precision": 20}	Vietnamese Dong	2026-02-19 13:41:02.461+05:30	2026-02-19 13:41:02.461+05:30	\N
xaf	FCFA	FCFA	0	0	{"value": "0", "precision": 20}	CFA Franc BEAC	2026-02-19 13:41:02.461+05:30	2026-02-19 13:41:02.461+05:30	\N
xof	CFA	CFA	0	0	{"value": "0", "precision": 20}	CFA Franc BCEAO	2026-02-19 13:41:02.461+05:30	2026-02-19 13:41:02.461+05:30	\N
xpf	₣	₣	0	0	{"value": "0", "precision": 20}	CFP Franc	2026-02-19 13:41:02.461+05:30	2026-02-19 13:41:02.461+05:30	\N
yer	YR	ر.ي.‏	0	0	{"value": "0", "precision": 20}	Yemeni Rial	2026-02-19 13:41:02.461+05:30	2026-02-19 13:41:02.461+05:30	\N
zar	R	R	2	0	{"value": "0", "precision": 20}	South African Rand	2026-02-19 13:41:02.461+05:30	2026-02-19 13:41:02.461+05:30	\N
zmk	ZK	ZK	0	0	{"value": "0", "precision": 20}	Zambian Kwacha	2026-02-19 13:41:02.461+05:30	2026-02-19 13:41:02.461+05:30	\N
zwl	ZWL$	ZWL$	0	0	{"value": "0", "precision": 20}	Zimbabwean Dollar	2026-02-19 13:41:02.461+05:30	2026-02-19 13:41:02.461+05:30	\N
\.


--
-- Data for Name: customer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customer (id, company_name, first_name, last_name, email, phone, has_account, metadata, created_at, updated_at, deleted_at, created_by) FROM stdin;
cus_01KHTPY41MVZPW7MHG4WCR9SWP	\N	chetandsdf	tikkal	chetan.novarsis@gmail.com	7771824784	t	{"wishlist": []}	2026-02-19 15:55:38.869+05:30	2026-02-20 12:41:32.608+05:30	\N	\N
\.


--
-- Data for Name: customer_account_holder; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customer_account_holder (customer_id, account_holder_id, id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: customer_address; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customer_address (id, customer_id, address_name, is_default_shipping, is_default_billing, company, first_name, last_name, address_1, address_2, city, country_code, province, postal_code, phone, metadata, created_at, updated_at, deleted_at) FROM stdin;
cuaddr_01KHWZ9V2625ARTESDPHBP80E0	cus_01KHTPY41MVZPW7MHG4WCR9SWP	\N	t	f		chetan	tikkal	sdgsd	af	indore	in	mp	121212	7771454788	\N	2026-02-20 13:00:20.359+05:30	2026-02-20 13:00:20.359+05:30	\N
cuaddr_01KHWZAE472K4DCS9BP1XFN7BN	cus_01KHTPY41MVZPW7MHG4WCR9SWP	\N	f	f	ad	adfasd	adsf	asd		indore	in	mp	123123	1234567891	\N	2026-02-20 13:00:39.88+05:30	2026-02-20 13:00:39.88+05:30	\N
\.


--
-- Data for Name: customer_group; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customer_group (id, name, metadata, created_by, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: customer_group_customer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customer_group_customer (id, customer_id, customer_group_id, metadata, created_at, updated_at, created_by, deleted_at) FROM stdin;
\.


--
-- Data for Name: fulfillment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fulfillment (id, location_id, packed_at, shipped_at, delivered_at, canceled_at, data, provider_id, shipping_option_id, metadata, delivery_address_id, created_at, updated_at, deleted_at, marked_shipped_by, created_by, requires_shipping) FROM stdin;
ful_01KHX3ZT8N42TSPQFA542A90RK	sloc_01KHTKFY2C5P1JPMTTXXM6BQTB	2026-02-20 14:22:14.718+05:30	2026-02-20 14:23:42.419+05:30	2026-02-20 14:24:49.844+05:30	\N	{}	manual_manual	so_01KHTKFY58XNN3M9WYSRN52W9P	\N	fuladdr_01KHX3ZT8N4NA80VG2TJ2XVXDY	2026-02-20 14:22:14.742+05:30	2026-02-20 14:24:49.86+05:30	\N	\N	\N	t
ful_01KHXG8EE2Q9D9ANXE45RG3JXH	sloc_01KHTKFY2C5P1JPMTTXXM6BQTB	2026-02-20 17:56:40.431+05:30	\N	\N	\N	{}	manual_manual	so_01KHTKFY58XNN3M9WYSRN52W9P	\N	fuladdr_01KHXG8EE2DR6ND61KDSRPGKTD	2026-02-20 17:56:40.451+05:30	2026-02-20 17:56:40.451+05:30	\N	\N	\N	t
\.


--
-- Data for Name: fulfillment_address; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fulfillment_address (id, company, first_name, last_name, address_1, address_2, city, country_code, province, postal_code, phone, metadata, created_at, updated_at, deleted_at) FROM stdin;
fuladdr_01KHX3ZT8N4NA80VG2TJ2XVXDY		chetan	tikkal	abcd		bihar	in	dsads	121211		\N	2026-02-20 12:58:01.356+05:30	2026-02-20 12:58:01.356+05:30	\N
fuladdr_01KHXG8EE2DR6ND61KDSRPGKTD		chetan	tikkal	abcd		bihar	in	jharkhand	121212	1234567891	\N	2026-02-19 16:26:17.529+05:30	2026-02-19 16:26:17.529+05:30	\N
\.


--
-- Data for Name: fulfillment_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fulfillment_item (id, title, sku, barcode, quantity, raw_quantity, line_item_id, inventory_item_id, fulfillment_id, created_at, updated_at, deleted_at) FROM stdin;
fulit_01KHX3ZT8K0G15QWFWNG59JMC5	500g Bottle	GHEE-500		1	{"value": "1", "precision": 20}	ordli_01KHWZ6QHAXPSPDF5Z6WBM5A8K	iitem_01KHTKFYCTCB81PDCQMX1QS4HN	ful_01KHX3ZT8N42TSPQFA542A90RK	2026-02-20 14:22:14.743+05:30	2026-02-20 14:22:14.743+05:30	\N
fulit_01KHXG8EE1NR0TNEPMWRJ6DEWC	1 Pack	MULTI-ATTA-1		1	{"value": "1", "precision": 20}	ordli_01KHTRQT2KY54K00QSF4W0ZWKS	iitem_01KHTKFYCSC5JZKQ4Y9KV4CNMM	ful_01KHXG8EE2Q9D9ANXE45RG3JXH	2026-02-20 17:56:40.451+05:30	2026-02-20 17:56:40.451+05:30	\N
\.


--
-- Data for Name: fulfillment_label; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fulfillment_label (id, tracking_number, tracking_url, label_url, fulfillment_id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: fulfillment_provider; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fulfillment_provider (id, is_enabled, created_at, updated_at, deleted_at) FROM stdin;
manual_manual	t	2026-02-19 13:41:02.473+05:30	2026-02-19 13:41:02.473+05:30	\N
\.


--
-- Data for Name: fulfillment_set; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fulfillment_set (id, name, type, metadata, created_at, updated_at, deleted_at) FROM stdin;
fuset_01KHTKFY3C0W15HWPCFPD8SMA2	India Delivery	shipping	\N	2026-02-19 14:55:28.3+05:30	2026-02-19 14:55:28.3+05:30	\N
\.


--
-- Data for Name: geo_zone; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.geo_zone (id, type, country_code, province_code, city, service_zone_id, postal_expression, metadata, created_at, updated_at, deleted_at) FROM stdin;
fgz_01KHTKFY3BWR40NG6SST8T3K0D	country	in	\N	\N	serzo_01KHTKFY3CBKYV2YREWNWF6NPX	\N	\N	2026-02-19 14:55:28.3+05:30	2026-02-19 14:55:28.3+05:30	\N
\.


--
-- Data for Name: image; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.image (id, url, metadata, created_at, updated_at, deleted_at, rank, product_id) FROM stdin;
74ycd	http://localhost:9000/static/1771495366842-image-1771495065516.png	\N	2026-02-19 15:32:46.964+05:30	2026-02-19 15:32:46.964+05:30	\N	0	prod_01KHTKFY8VZPJS9GHQAWR5FNNW
8l627j	http://localhost:9000/static/1771495366843-image-1771495146316.png	\N	2026-02-19 15:32:46.964+05:30	2026-02-19 15:32:46.964+05:30	\N	1	prod_01KHTKFY8VZPJS9GHQAWR5FNNW
fq7lnw	http://localhost:9000/static/1771495366846-image-1771495180890.png	\N	2026-02-19 15:32:46.964+05:30	2026-02-19 15:32:46.964+05:30	\N	2	prod_01KHTKFY8VZPJS9GHQAWR5FNNW
1fl7sj	http://localhost:9000/static/1771495366850-image-1771495234876.png	\N	2026-02-19 15:32:46.965+05:30	2026-02-19 15:32:46.965+05:30	\N	3	prod_01KHTKFY8VZPJS9GHQAWR5FNNW
6peguf	http://localhost:9000/static/1771495366853-image-1771495262796.png	\N	2026-02-19 15:32:46.965+05:30	2026-02-19 15:32:46.965+05:30	\N	4	prod_01KHTKFY8VZPJS9GHQAWR5FNNW
knm8kc	http://localhost:9000/static/1771495366859-image-1771495288646.png	\N	2026-02-19 15:32:46.965+05:30	2026-02-19 15:32:46.965+05:30	\N	5	prod_01KHTKFY8VZPJS9GHQAWR5FNNW
skvhx	http://localhost:9000/static/1771495366862-image-1771495309052.png	\N	2026-02-19 15:32:46.965+05:30	2026-02-19 15:32:46.965+05:30	\N	6	prod_01KHTKFY8VZPJS9GHQAWR5FNNW
xsrbd	http://localhost:9000/static/1771495366866-image-1771495333882.png	\N	2026-02-19 15:32:46.965+05:30	2026-02-19 15:32:46.965+05:30	\N	7	prod_01KHTKFY8VZPJS9GHQAWR5FNNW
m7o2b8	http://localhost:9000/static/1771496164790-image-1771495514412.png	\N	2026-02-19 15:46:04.907+05:30	2026-02-19 15:46:04.907+05:30	\N	0	prod_01KHTKFY8VDC4G7YD60DP3RVC1
9cpvdd	http://localhost:9000/static/1771496164792-image-1771495656335.png	\N	2026-02-19 15:46:04.907+05:30	2026-02-19 15:46:04.907+05:30	\N	1	prod_01KHTKFY8VDC4G7YD60DP3RVC1
moee	http://localhost:9000/static/1771496164796-image-1771495688972.png	\N	2026-02-19 15:46:04.907+05:30	2026-02-19 15:46:04.907+05:30	\N	2	prod_01KHTKFY8VDC4G7YD60DP3RVC1
cbawfj	http://localhost:9000/static/1771496164800-image-1771495789890.png	\N	2026-02-19 15:46:04.907+05:30	2026-02-19 15:46:04.907+05:30	\N	3	prod_01KHTKFY8VDC4G7YD60DP3RVC1
ns0xc	http://localhost:9000/static/1771496164802-image-1771495899159.png	\N	2026-02-19 15:46:04.907+05:30	2026-02-19 15:46:04.907+05:30	\N	4	prod_01KHTKFY8VDC4G7YD60DP3RVC1
2lw76v	http://localhost:9000/static/1771496164803-image-1771495992704.png	\N	2026-02-19 15:46:04.907+05:30	2026-02-19 15:46:04.909+05:30	\N	5	prod_01KHTKFY8VDC4G7YD60DP3RVC1
wn5g1j	http://localhost:9000/static/1771496164809-image-1771496013794.png	\N	2026-02-19 15:46:04.909+05:30	2026-02-19 15:46:04.909+05:30	\N	6	prod_01KHTKFY8VDC4G7YD60DP3RVC1
mjddpu	http://localhost:9000/static/1771496164811-image-1771496034733.png	\N	2026-02-19 15:46:04.909+05:30	2026-02-19 15:46:04.909+05:30	\N	7	prod_01KHTKFY8VDC4G7YD60DP3RVC1
8hwg1	http://localhost:9000/static/1771496164816-image-1771496068362.png	\N	2026-02-19 15:46:04.909+05:30	2026-02-19 15:46:04.909+05:30	\N	8	prod_01KHTKFY8VDC4G7YD60DP3RVC1
6quk4	http://localhost:9000/static/1771563167592-image-1771562688728.png	\N	2026-02-20 10:22:47.775+05:30	2026-02-20 10:22:47.775+05:30	\N	0	prod_01KHTKFY8VS3ECJSEKB0B0BXCH
d2cqr	http://localhost:9000/static/1771563167593-image-1771562714215.png	\N	2026-02-20 10:22:47.776+05:30	2026-02-20 10:22:47.776+05:30	\N	1	prod_01KHTKFY8VS3ECJSEKB0B0BXCH
x9al58	http://localhost:9000/static/1771563167595-image-1771562890700.png	\N	2026-02-20 10:22:47.776+05:30	2026-02-20 10:22:47.776+05:30	\N	2	prod_01KHTKFY8VS3ECJSEKB0B0BXCH
36f2l	http://localhost:9000/static/1771563167597-image-1771562922060.png	\N	2026-02-20 10:22:47.776+05:30	2026-02-20 10:22:47.776+05:30	\N	3	prod_01KHTKFY8VS3ECJSEKB0B0BXCH
xiuowm	http://localhost:9000/static/1771563167598-image-1771562945269.png	\N	2026-02-20 10:22:47.776+05:30	2026-02-20 10:22:47.777+05:30	\N	4	prod_01KHTKFY8VS3ECJSEKB0B0BXCH
9quwom	http://localhost:9000/static/1771563167600-image-1771562970534.png	\N	2026-02-20 10:22:47.777+05:30	2026-02-20 10:22:47.777+05:30	\N	5	prod_01KHTKFY8VS3ECJSEKB0B0BXCH
1x9vbo	http://localhost:9000/static/1771563167601-image-1771562999607.png	\N	2026-02-20 10:22:47.777+05:30	2026-02-20 10:22:47.777+05:30	\N	6	prod_01KHTKFY8VS3ECJSEKB0B0BXCH
bqdr6r	http://localhost:9000/static/1771563167603-image-1771563034438.png	\N	2026-02-20 10:22:47.777+05:30	2026-02-20 10:22:47.777+05:30	\N	7	prod_01KHTKFY8VS3ECJSEKB0B0BXCH
nwr6xd	http://localhost:9000/static/1771563167604-image-1771563056965.png	\N	2026-02-20 10:22:47.777+05:30	2026-02-20 10:22:47.777+05:30	\N	8	prod_01KHTKFY8VS3ECJSEKB0B0BXCH
e59ylq	http://localhost:9000/static/1771563520880-image-1771563294600.png	\N	2026-02-20 10:28:41.032+05:30	2026-02-20 10:28:41.032+05:30	\N	0	prod_01KHTKFY8WJRREXEG56P1SS1H0
5mcop	http://localhost:9000/static/1771563520883-image-1771563325008.png	\N	2026-02-20 10:28:41.032+05:30	2026-02-20 10:28:41.032+05:30	\N	1	prod_01KHTKFY8WJRREXEG56P1SS1H0
uanuk	http://localhost:9000/static/1771563520881-image-1771563341247.png	\N	2026-02-20 10:28:41.032+05:30	2026-02-20 10:28:41.032+05:30	\N	2	prod_01KHTKFY8WJRREXEG56P1SS1H0
27tdr6	http://localhost:9000/static/1771563520882-image-1771563362352.png	\N	2026-02-20 10:28:41.032+05:30	2026-02-20 10:28:41.032+05:30	\N	3	prod_01KHTKFY8WJRREXEG56P1SS1H0
ot1uqe	http://localhost:9000/static/1771563520884-image-1771563400297.png	\N	2026-02-20 10:28:41.032+05:30	2026-02-20 10:28:41.032+05:30	\N	4	prod_01KHTKFY8WJRREXEG56P1SS1H0
odmj9s	http://localhost:9000/static/1771563520886-image-1771563420177.png	\N	2026-02-20 10:28:41.032+05:30	2026-02-20 10:28:41.032+05:30	\N	5	prod_01KHTKFY8WJRREXEG56P1SS1H0
mkspfp	http://localhost:9000/static/1771563520890-image-1771563436883.png	\N	2026-02-20 10:28:41.032+05:30	2026-02-20 10:28:41.032+05:30	\N	6	prod_01KHTKFY8WJRREXEG56P1SS1H0
j00duh	http://localhost:9000/static/1771563520892-image-1771563455381.png	\N	2026-02-20 10:28:41.032+05:30	2026-02-20 10:28:41.032+05:30	\N	7	prod_01KHTKFY8WJRREXEG56P1SS1H0
1est0e	http://localhost:9000/static/1771563520895-image-1771563473833.png	\N	2026-02-20 10:28:41.032+05:30	2026-02-20 10:28:41.032+05:30	\N	8	prod_01KHTKFY8WJRREXEG56P1SS1H0
img_01KHWRQ31MNGXQS75YQJTM0RY9	http://localhost:9000/static/1771565714462-image-1771563802824.png	\N	2026-02-20 11:05:14.486+05:30	2026-02-20 11:05:14.486+05:30	\N	0	prod_01KHWRQ31J9VGVRDJ4STXTZW2D
img_01KHWRQ31MZW052Z4HQ4ZDCG8H	http://localhost:9000/static/1771565714462-image-1771565015834.png	\N	2026-02-20 11:05:14.486+05:30	2026-02-20 11:05:14.486+05:30	\N	1	prod_01KHWRQ31J9VGVRDJ4STXTZW2D
img_01KHWRQ31MEHFTCTTDYDC592MH	http://localhost:9000/static/1771565714463-image-1771565083367.png	\N	2026-02-20 11:05:14.486+05:30	2026-02-20 11:05:14.486+05:30	\N	2	prod_01KHWRQ31J9VGVRDJ4STXTZW2D
img_01KHWRQ31MAVC0JWHRBR2MFHWR	http://localhost:9000/static/1771565714466-image-1771565105722.png	\N	2026-02-20 11:05:14.486+05:30	2026-02-20 11:05:14.486+05:30	\N	3	prod_01KHWRQ31J9VGVRDJ4STXTZW2D
img_01KHWRQ31MJ4XR8H1KPM8KV8A5	http://localhost:9000/static/1771565714464-image-1771565128461.png	\N	2026-02-20 11:05:14.486+05:30	2026-02-20 11:05:14.486+05:30	\N	4	prod_01KHWRQ31J9VGVRDJ4STXTZW2D
qt8i1o	http://localhost:9000/static/1771566277896-image-1771566216155.png	\N	2026-02-20 11:14:37.948+05:30	2026-02-20 11:14:37.949+05:30	\N	0	prod_01KHTKFY8WWARWZEMAVTJ7EHT1
4dgpqa	http://localhost:9000/static/1771566277896-image-1771566242536.png	\N	2026-02-20 11:14:37.949+05:30	2026-02-20 11:14:37.949+05:30	\N	1	prod_01KHTKFY8WWARWZEMAVTJ7EHT1
4i35nr	http://localhost:9000/static/1771566477309-image-1771563294600.png	\N	2026-02-20 11:17:57.424+05:30	2026-02-20 11:17:57.424+05:30	\N	0	prod_01KHTKFY8WT4SCZ4AMAKQ4F16M
jj2uz9v	http://localhost:9000/static/1771566477313-image-1771563325008.png	\N	2026-02-20 11:17:57.424+05:30	2026-02-20 11:17:57.424+05:30	\N	1	prod_01KHTKFY8WT4SCZ4AMAKQ4F16M
f9j6bo	http://localhost:9000/static/1771566477314-image-1771563341247.png	\N	2026-02-20 11:17:57.424+05:30	2026-02-20 11:17:57.424+05:30	\N	2	prod_01KHTKFY8WT4SCZ4AMAKQ4F16M
1ofa5r	http://localhost:9000/static/1771566477317-image-1771563362352.png	\N	2026-02-20 11:17:57.424+05:30	2026-02-20 11:17:57.424+05:30	\N	3	prod_01KHTKFY8WT4SCZ4AMAKQ4F16M
e31mz9	http://localhost:9000/static/1771566477337-image-1771563400297.png	\N	2026-02-20 11:17:57.424+05:30	2026-02-20 11:17:57.424+05:30	\N	4	prod_01KHTKFY8WT4SCZ4AMAKQ4F16M
kt14pq	http://localhost:9000/static/1771566477341-image-1771563420177.png	\N	2026-02-20 11:17:57.424+05:30	2026-02-20 11:17:57.424+05:30	\N	5	prod_01KHTKFY8WT4SCZ4AMAKQ4F16M
82tocj	http://localhost:9000/static/1771566477342-image-1771563436883.png	\N	2026-02-20 11:17:57.424+05:30	2026-02-20 11:17:57.424+05:30	\N	6	prod_01KHTKFY8WT4SCZ4AMAKQ4F16M
h5uknr	http://localhost:9000/static/1771566477343-image-1771563455381.png	\N	2026-02-20 11:17:57.424+05:30	2026-02-20 11:17:57.424+05:30	\N	7	prod_01KHTKFY8WT4SCZ4AMAKQ4F16M
8osfmk	http://localhost:9000/static/1771566477346-image-1771563473833.png	\N	2026-02-20 11:17:57.424+05:30	2026-02-20 11:17:57.424+05:30	\N	8	prod_01KHTKFY8WT4SCZ4AMAKQ4F16M
img_01KHTKFY92K3X2ZDNTH3XFWNRD	https://placehold.co/600x400?text=Bajra%20Atta	\N	2026-02-19 14:55:28.486+05:30	2026-02-20 11:18:50.102+05:30	2026-02-20 11:18:50.085+05:30	0	prod_01KHTKFY8VSZPCJHT6NHEJ88ET
v7vwmc	http://localhost:9000/static/1771569404776-image-1771569324022.png	\N	2026-02-20 12:06:44.836+05:30	2026-02-20 12:06:44.836+05:30	\N	0	prod_01KHTKFY8WJSF8SQ05MV2PS7J8
27vyfp	http://localhost:9000/static/1771569404777-image-1771569339342.png	\N	2026-02-20 12:06:44.836+05:30	2026-02-20 12:06:44.836+05:30	\N	1	prod_01KHTKFY8WJSF8SQ05MV2PS7J8
zkxaqc	http://localhost:9000/static/1771569404779-image-1771569353336.png	\N	2026-02-20 12:06:44.836+05:30	2026-02-20 12:06:44.836+05:30	\N	2	prod_01KHTKFY8WJSF8SQ05MV2PS7J8
zj923	http://localhost:9000/static/1771569404781-image-1771569376520.png	\N	2026-02-20 12:06:44.836+05:30	2026-02-20 12:06:44.836+05:30	\N	3	prod_01KHTKFY8WJSF8SQ05MV2PS7J8
\.


--
-- Data for Name: inventory_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventory_item (id, created_at, updated_at, deleted_at, sku, origin_country, hs_code, mid_code, material, weight, length, height, width, requires_shipping, description, title, thumbnail, metadata) FROM stdin;
iitem_01KHTKFYCSC5JZKQ4Y9KV4CNMM	2026-02-19 14:55:28.602+05:30	2026-02-19 14:55:28.602+05:30	\N	MULTI-ATTA-1	\N	\N	\N	\N	\N	\N	\N	\N	t	1 Pack	1 Pack	\N	\N
iitem_01KHTKFYCT6Q0GZB6ZAF12Z2MS	2026-02-19 14:55:28.603+05:30	2026-02-19 14:55:28.603+05:30	\N	WHEAT-ATTA-1	\N	\N	\N	\N	\N	\N	\N	\N	t	1 Pack	1 Pack	\N	\N
iitem_01KHTKFYCTWZZ7XY5JQ4MCV3F9	2026-02-19 14:55:28.603+05:30	2026-02-19 14:55:28.603+05:30	\N	JOWAR-ATTA-1	\N	\N	\N	\N	\N	\N	\N	\N	t	1 Pack	1 Pack	\N	\N
iitem_01KHTKFYCT4PX9XJ656M0ZS506	2026-02-19 14:55:28.603+05:30	2026-02-19 14:55:28.603+05:30	\N	MORINGA-SATTU-500	\N	\N	\N	\N	\N	\N	\N	\N	t	500g	500g	\N	\N
iitem_01KHTKFYCTGT9NTYSJMQHGVVV0	2026-02-19 14:55:28.603+05:30	2026-02-19 14:55:28.603+05:30	\N	SATTU-500	\N	\N	\N	\N	\N	\N	\N	\N	t	500g	500g	\N	\N
iitem_01KHTKFYCT2DG9C8SS0TSCB42K	2026-02-19 14:55:28.603+05:30	2026-02-19 14:55:28.603+05:30	\N	GOUSARRAM-CAP-30	\N	\N	\N	\N	\N	\N	\N	\N	t	30 pcs Bottle	30 pcs Bottle	\N	\N
iitem_01KHTKFYCTCB81PDCQMX1QS4HN	2026-02-19 14:55:28.603+05:30	2026-02-19 14:55:28.603+05:30	\N	GHEE-500	\N	\N	\N	\N	\N	\N	\N	\N	t	500g Bottle	500g Bottle	\N	\N
iitem_01KHWRYE1SXCADCZQYBZV6FWSD	2026-02-20 11:09:15.129+05:30	2026-02-20 11:11:55.022+05:30	\N	moong-500	\N	\N	\N	\N	500	\N	\N	\N	t	moong multigrain atta 500 g	500g	\N	\N
iitem_01KHTKFYCTS2RSNBB41KXB9N84	2026-02-19 14:55:28.603+05:30	2026-02-20 11:18:50.057+05:30	2026-02-20 11:18:50.056+05:30	BAJRA-ATTA-1	\N	\N	\N	\N	\N	\N	\N	\N	t	1 Pack	1 Pack	\N	\N
iitem_01KHWXH4DJBAJ8DZXAYJKQR2HD	2026-02-20 12:29:22.162+05:30	2026-02-20 12:45:33.25+05:30	\N	moong-1	\N	\N	\N	\N	\N	\N	\N	1000	t	moong multigrain 1kg	1kg	\N	\N
\.


--
-- Data for Name: inventory_level; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventory_level (id, created_at, updated_at, deleted_at, inventory_item_id, location_id, stocked_quantity, reserved_quantity, incoming_quantity, metadata, raw_stocked_quantity, raw_reserved_quantity, raw_incoming_quantity) FROM stdin;
ilev_01KHTKFYFW44C6KRZB4MVD53PR	2026-02-19 14:55:28.702+05:30	2026-02-19 14:55:28.702+05:30	\N	iitem_01KHTKFYCT2DG9C8SS0TSCB42K	sloc_01KHTKFY2C5P1JPMTTXXM6BQTB	810	0	0	\N	{"value": "810", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01KHTKFYFWMT8FCMTYFBDFJV9E	2026-02-19 14:55:28.702+05:30	2026-02-19 14:55:28.702+05:30	\N	iitem_01KHTKFYCT4PX9XJ656M0ZS506	sloc_01KHTKFY2C5P1JPMTTXXM6BQTB	514	0	0	\N	{"value": "514", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01KHTKFYFW6FTTJ7G8B2J0XH28	2026-02-19 14:55:28.702+05:30	2026-02-19 14:55:28.702+05:30	\N	iitem_01KHTKFYCT6Q0GZB6ZAF12Z2MS	sloc_01KHTKFY2C5P1JPMTTXXM6BQTB	779	0	0	\N	{"value": "779", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01KHTKFYFXSR53F2952AWPWB1G	2026-02-19 14:55:28.702+05:30	2026-02-19 14:55:28.702+05:30	\N	iitem_01KHTKFYCTGT9NTYSJMQHGVVV0	sloc_01KHTKFY2C5P1JPMTTXXM6BQTB	627	0	0	\N	{"value": "627", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01KHTKFYFXPY471F8HQZ8K5GPJ	2026-02-19 14:55:28.702+05:30	2026-02-19 14:55:28.702+05:30	\N	iitem_01KHTKFYCTWZZ7XY5JQ4MCV3F9	sloc_01KHTKFY2C5P1JPMTTXXM6BQTB	745	0	0	\N	{"value": "745", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01KHWRYE385QYJAD9Y588TJ71B	2026-02-20 11:09:15.176+05:30	2026-02-20 11:09:15.176+05:30	\N	iitem_01KHWRYE1SXCADCZQYBZV6FWSD	sloc_01KHTKFY2C5P1JPMTTXXM6BQTB	1000	0	0	\N	{"value": "1000", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01KHTKFYFXW48K1F0T3PAV38RG	2026-02-19 14:55:28.702+05:30	2026-02-20 11:18:50.066+05:30	2026-02-20 11:18:50.056+05:30	iitem_01KHTKFYCTS2RSNBB41KXB9N84	sloc_01KHTKFY2C5P1JPMTTXXM6BQTB	990	0	0	\N	{"value": "990", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01KHWXH4EWVCRXPA7YCH9A6TGT	2026-02-20 12:29:22.204+05:30	2026-02-20 12:29:22.204+05:30	\N	iitem_01KHWXH4DJBAJ8DZXAYJKQR2HD	sloc_01KHTKFY2C5P1JPMTTXXM6BQTB	999	0	0	\N	{"value": "999", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01KHTKFYFXYJZSK5DHE1ZW7P8Z	2026-02-19 14:55:28.702+05:30	2026-02-20 14:22:14.829+05:30	\N	iitem_01KHTKFYCTCB81PDCQMX1QS4HN	sloc_01KHTKFY2C5P1JPMTTXXM6BQTB	564	0	0	\N	{"value": "564", "precision": 20}	{"value": "0", "precision": 20}	{"value": "0", "precision": 20}
ilev_01KHTKFYFWBHYVP0M8Q4RQAAR2	2026-02-19 14:55:28.701+05:30	2026-02-21 17:28:04.503+05:30	\N	iitem_01KHTKFYCSC5JZKQ4Y9KV4CNMM	sloc_01KHTKFY2C5P1JPMTTXXM6BQTB	706	1	0	\N	{"value": "706", "precision": 20}	{"value": "1", "precision": 20}	{"value": "0", "precision": 20}
\.


--
-- Data for Name: invite; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.invite (id, email, accepted, token, expires_at, metadata, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: link_module_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.link_module_migrations (id, table_name, link_descriptor, created_at) FROM stdin;
1	cart_payment_collection	{"toModel": "payment_collection", "toModule": "payment", "fromModel": "cart", "fromModule": "cart"}	2026-02-19 13:40:59.008159
2	cart_promotion	{"toModel": "promotions", "toModule": "promotion", "fromModel": "cart", "fromModule": "cart"}	2026-02-19 13:40:59.02094
3	customer_account_holder	{"toModel": "account_holder", "toModule": "payment", "fromModel": "customer", "fromModule": "customer"}	2026-02-19 13:40:59.027783
4	location_fulfillment_provider	{"toModel": "fulfillment_provider", "toModule": "fulfillment", "fromModel": "location", "fromModule": "stock_location"}	2026-02-19 13:40:59.034398
5	location_fulfillment_set	{"toModel": "fulfillment_set", "toModule": "fulfillment", "fromModel": "location", "fromModule": "stock_location"}	2026-02-19 13:40:59.040718
6	order_cart	{"toModel": "cart", "toModule": "cart", "fromModel": "order", "fromModule": "order"}	2026-02-19 13:40:59.047108
7	order_fulfillment	{"toModel": "fulfillments", "toModule": "fulfillment", "fromModel": "order", "fromModule": "order"}	2026-02-19 13:40:59.053539
8	order_payment_collection	{"toModel": "payment_collection", "toModule": "payment", "fromModel": "order", "fromModule": "order"}	2026-02-19 13:40:59.066049
9	order_promotion	{"toModel": "promotions", "toModule": "promotion", "fromModel": "order", "fromModule": "order"}	2026-02-19 13:40:59.083596
10	return_fulfillment	{"toModel": "fulfillments", "toModule": "fulfillment", "fromModel": "return", "fromModule": "order"}	2026-02-19 13:40:59.092821
11	product_sales_channel	{"toModel": "sales_channel", "toModule": "sales_channel", "fromModel": "product", "fromModule": "product"}	2026-02-19 13:40:59.099748
12	product_shipping_profile	{"toModel": "shipping_profile", "toModule": "fulfillment", "fromModel": "product", "fromModule": "product"}	2026-02-19 13:40:59.106932
13	product_variant_inventory_item	{"toModel": "inventory", "toModule": "inventory", "fromModel": "variant", "fromModule": "product"}	2026-02-19 13:40:59.112939
14	product_variant_price_set	{"toModel": "price_set", "toModule": "pricing", "fromModel": "variant", "fromModule": "product"}	2026-02-19 13:40:59.118675
15	publishable_api_key_sales_channel	{"toModel": "sales_channel", "toModule": "sales_channel", "fromModel": "api_key", "fromModule": "api_key"}	2026-02-19 13:40:59.124436
16	region_payment_provider	{"toModel": "payment_provider", "toModule": "payment", "fromModel": "region", "fromModule": "region"}	2026-02-19 13:40:59.130637
17	sales_channel_stock_location	{"toModel": "location", "toModule": "stock_location", "fromModel": "sales_channel", "fromModule": "sales_channel"}	2026-02-19 13:40:59.136726
18	shipping_option_price_set	{"toModel": "price_set", "toModule": "pricing", "fromModel": "shipping_option", "fromModule": "fulfillment"}	2026-02-19 13:40:59.142986
19	user_rbac_role	{"toModel": "rbac_role", "toModule": "rbac", "fromModel": "user", "fromModule": "user"}	2026-02-19 13:40:59.149138
\.


--
-- Data for Name: location_fulfillment_provider; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.location_fulfillment_provider (stock_location_id, fulfillment_provider_id, id, created_at, updated_at, deleted_at) FROM stdin;
sloc_01KHTKFY2C5P1JPMTTXXM6BQTB	manual_manual	locfp_01KHTKFY2Y718FQRVZHXCS2HNE	2026-02-19 14:55:28.286464+05:30	2026-02-19 14:55:28.286464+05:30	\N
\.


--
-- Data for Name: location_fulfillment_set; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.location_fulfillment_set (stock_location_id, fulfillment_set_id, id, created_at, updated_at, deleted_at) FROM stdin;
sloc_01KHTKFY2C5P1JPMTTXXM6BQTB	fuset_01KHTKFY3C0W15HWPCFPD8SMA2	locfs_01KHTKFY3YFAW9DWEF4S908QPG	2026-02-19 14:55:28.318391+05:30	2026-02-19 14:55:28.318391+05:30	\N
\.


--
-- Data for Name: mikro_orm_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mikro_orm_migrations (id, name, executed_at) FROM stdin;
1	Migration20240307161216	2026-02-19 13:40:49.63843+05:30
2	Migration20241210073813	2026-02-19 13:40:49.63843+05:30
3	Migration20250106142624	2026-02-19 13:40:49.63843+05:30
4	Migration20250120110820	2026-02-19 13:40:49.63843+05:30
5	Migration20240307132720	2026-02-19 13:40:49.855815+05:30
6	Migration20240719123015	2026-02-19 13:40:49.855815+05:30
7	Migration20241213063611	2026-02-19 13:40:49.855815+05:30
8	Migration20251010131115	2026-02-19 13:40:49.855815+05:30
9	InitialSetup20240401153642	2026-02-19 13:40:50.064625+05:30
10	Migration20240601111544	2026-02-19 13:40:50.064625+05:30
11	Migration202408271511	2026-02-19 13:40:50.064625+05:30
12	Migration20241122120331	2026-02-19 13:40:50.064625+05:30
13	Migration20241125090957	2026-02-19 13:40:50.064625+05:30
14	Migration20250411073236	2026-02-19 13:40:50.064625+05:30
15	Migration20250516081326	2026-02-19 13:40:50.064625+05:30
16	Migration20250910154539	2026-02-19 13:40:50.064625+05:30
17	Migration20250911092221	2026-02-19 13:40:50.064625+05:30
18	Migration20250929204438	2026-02-19 13:40:50.064625+05:30
19	Migration20251008132218	2026-02-19 13:40:50.064625+05:30
20	Migration20251011090511	2026-02-19 13:40:50.064625+05:30
21	Migration20230929122253	2026-02-19 13:40:50.412186+05:30
22	Migration20240322094407	2026-02-19 13:40:50.412186+05:30
23	Migration20240322113359	2026-02-19 13:40:50.412186+05:30
24	Migration20240322120125	2026-02-19 13:40:50.412186+05:30
25	Migration20240626133555	2026-02-19 13:40:50.412186+05:30
26	Migration20240704094505	2026-02-19 13:40:50.412186+05:30
27	Migration20241127114534	2026-02-19 13:40:50.412186+05:30
28	Migration20241127223829	2026-02-19 13:40:50.412186+05:30
29	Migration20241128055359	2026-02-19 13:40:50.412186+05:30
30	Migration20241212190401	2026-02-19 13:40:50.412186+05:30
31	Migration20250408145122	2026-02-19 13:40:50.412186+05:30
32	Migration20250409122219	2026-02-19 13:40:50.412186+05:30
33	Migration20251009110625	2026-02-19 13:40:50.412186+05:30
34	Migration20251112192723	2026-02-19 13:40:50.412186+05:30
35	Migration20240227120221	2026-02-19 13:40:50.771917+05:30
36	Migration20240617102917	2026-02-19 13:40:50.771917+05:30
37	Migration20240624153824	2026-02-19 13:40:50.771917+05:30
38	Migration20241211061114	2026-02-19 13:40:50.771917+05:30
39	Migration20250113094144	2026-02-19 13:40:50.771917+05:30
40	Migration20250120110700	2026-02-19 13:40:50.771917+05:30
41	Migration20250226130616	2026-02-19 13:40:50.771917+05:30
42	Migration20250508081510	2026-02-19 13:40:50.771917+05:30
43	Migration20250828075407	2026-02-19 13:40:50.771917+05:30
44	Migration20250909083125	2026-02-19 13:40:50.771917+05:30
45	Migration20250916120552	2026-02-19 13:40:50.771917+05:30
46	Migration20250917143818	2026-02-19 13:40:50.771917+05:30
47	Migration20250919122137	2026-02-19 13:40:50.771917+05:30
48	Migration20251006000000	2026-02-19 13:40:50.771917+05:30
49	Migration20251015113934	2026-02-19 13:40:50.771917+05:30
50	Migration20251107050148	2026-02-19 13:40:50.771917+05:30
51	Migration20240124154000	2026-02-19 13:40:51.096614+05:30
52	Migration20240524123112	2026-02-19 13:40:51.096614+05:30
53	Migration20240602110946	2026-02-19 13:40:51.096614+05:30
54	Migration20241211074630	2026-02-19 13:40:51.096614+05:30
55	Migration20251010130829	2026-02-19 13:40:51.096614+05:30
56	Migration20240115152146	2026-02-19 13:40:51.340389+05:30
57	Migration20240222170223	2026-02-19 13:40:51.449512+05:30
58	Migration20240831125857	2026-02-19 13:40:51.449512+05:30
59	Migration20241106085918	2026-02-19 13:40:51.449512+05:30
60	Migration20241205095237	2026-02-19 13:40:51.449512+05:30
61	Migration20241216183049	2026-02-19 13:40:51.449512+05:30
62	Migration20241218091938	2026-02-19 13:40:51.449512+05:30
63	Migration20250120115059	2026-02-19 13:40:51.449512+05:30
64	Migration20250212131240	2026-02-19 13:40:51.449512+05:30
65	Migration20250326151602	2026-02-19 13:40:51.449512+05:30
66	Migration20250508081553	2026-02-19 13:40:51.449512+05:30
67	Migration20251017153909	2026-02-19 13:40:51.449512+05:30
68	Migration20251208130704	2026-02-19 13:40:51.449512+05:30
69	Migration20240205173216	2026-02-19 13:40:51.662295+05:30
70	Migration20240624200006	2026-02-19 13:40:51.662295+05:30
71	Migration20250120110744	2026-02-19 13:40:51.662295+05:30
72	InitialSetup20240221144943	2026-02-19 13:40:51.840823+05:30
73	Migration20240604080145	2026-02-19 13:40:51.840823+05:30
74	Migration20241205122700	2026-02-19 13:40:51.840823+05:30
75	Migration20251015123842	2026-02-19 13:40:51.840823+05:30
76	InitialSetup20240227075933	2026-02-19 13:40:52.14702+05:30
77	Migration20240621145944	2026-02-19 13:40:52.14702+05:30
78	Migration20241206083313	2026-02-19 13:40:52.14702+05:30
79	Migration20251202184737	2026-02-19 13:40:52.14702+05:30
80	Migration20251212161429	2026-02-19 13:40:52.14702+05:30
81	Migration20240227090331	2026-02-19 13:40:52.336387+05:30
82	Migration20240710135844	2026-02-19 13:40:52.336387+05:30
83	Migration20240924114005	2026-02-19 13:40:52.336387+05:30
84	Migration20241212052837	2026-02-19 13:40:52.336387+05:30
85	InitialSetup20240228133303	2026-02-19 13:40:52.451254+05:30
86	Migration20240624082354	2026-02-19 13:40:52.451254+05:30
87	Migration20240225134525	2026-02-19 13:40:52.679966+05:30
88	Migration20240806072619	2026-02-19 13:40:52.679966+05:30
89	Migration20241211151053	2026-02-19 13:40:52.679966+05:30
90	Migration20250115160517	2026-02-19 13:40:52.679966+05:30
91	Migration20250120110552	2026-02-19 13:40:52.679966+05:30
92	Migration20250123122334	2026-02-19 13:40:52.679966+05:30
93	Migration20250206105639	2026-02-19 13:40:52.679966+05:30
94	Migration20250207132723	2026-02-19 13:40:52.679966+05:30
95	Migration20250625084134	2026-02-19 13:40:52.679966+05:30
96	Migration20250924135437	2026-02-19 13:40:52.679966+05:30
97	Migration20250929124701	2026-02-19 13:40:52.679966+05:30
98	Migration20240219102530	2026-02-19 13:40:53.262733+05:30
99	Migration20240604100512	2026-02-19 13:40:53.262733+05:30
100	Migration20240715102100	2026-02-19 13:40:53.262733+05:30
101	Migration20240715174100	2026-02-19 13:40:53.262733+05:30
102	Migration20240716081800	2026-02-19 13:40:53.262733+05:30
103	Migration20240801085921	2026-02-19 13:40:53.262733+05:30
104	Migration20240821164505	2026-02-19 13:40:53.262733+05:30
105	Migration20240821170920	2026-02-19 13:40:53.262733+05:30
106	Migration20240827133639	2026-02-19 13:40:53.262733+05:30
107	Migration20240902195921	2026-02-19 13:40:53.262733+05:30
108	Migration20240913092514	2026-02-19 13:40:53.262733+05:30
109	Migration20240930122627	2026-02-19 13:40:53.262733+05:30
110	Migration20241014142943	2026-02-19 13:40:53.262733+05:30
111	Migration20241106085223	2026-02-19 13:40:53.262733+05:30
112	Migration20241129124827	2026-02-19 13:40:53.262733+05:30
113	Migration20241217162224	2026-02-19 13:40:53.262733+05:30
114	Migration20250326151554	2026-02-19 13:40:53.262733+05:30
115	Migration20250522181137	2026-02-19 13:40:53.262733+05:30
116	Migration20250702095353	2026-02-19 13:40:53.262733+05:30
117	Migration20250704120229	2026-02-19 13:40:53.262733+05:30
118	Migration20250910130000	2026-02-19 13:40:53.262733+05:30
119	Migration20251016160403	2026-02-19 13:40:53.262733+05:30
120	Migration20251016182939	2026-02-19 13:40:53.262733+05:30
121	Migration20251017155709	2026-02-19 13:40:53.262733+05:30
122	Migration20251114100559	2026-02-19 13:40:53.262733+05:30
123	Migration20251125164002	2026-02-19 13:40:53.262733+05:30
124	Migration20251210112909	2026-02-19 13:40:53.262733+05:30
125	Migration20251210112924	2026-02-19 13:40:53.262733+05:30
126	Migration20251225120947	2026-02-19 13:40:53.262733+05:30
127	Migration20250717162007	2026-02-19 13:40:53.826552+05:30
128	Migration20240205025928	2026-02-19 13:40:54.070599+05:30
129	Migration20240529080336	2026-02-19 13:40:54.070599+05:30
130	Migration20241202100304	2026-02-19 13:40:54.070599+05:30
131	Migration20240214033943	2026-02-19 13:40:55.065011+05:30
132	Migration20240703095850	2026-02-19 13:40:55.065011+05:30
133	Migration20241202103352	2026-02-19 13:40:55.065011+05:30
134	Migration20240311145700_InitialSetupMigration	2026-02-19 13:40:55.215438+05:30
135	Migration20240821170957	2026-02-19 13:40:55.215438+05:30
136	Migration20240917161003	2026-02-19 13:40:55.215438+05:30
137	Migration20241217110416	2026-02-19 13:40:55.215438+05:30
138	Migration20250113122235	2026-02-19 13:40:55.215438+05:30
139	Migration20250120115002	2026-02-19 13:40:55.215438+05:30
140	Migration20250822130931	2026-02-19 13:40:55.215438+05:30
141	Migration20250825132614	2026-02-19 13:40:55.215438+05:30
142	Migration20251114133146	2026-02-19 13:40:55.215438+05:30
143	Migration20240509083918_InitialSetupMigration	2026-02-19 13:40:55.893591+05:30
144	Migration20240628075401	2026-02-19 13:40:55.893591+05:30
145	Migration20240830094712	2026-02-19 13:40:55.893591+05:30
146	Migration20250120110514	2026-02-19 13:40:55.893591+05:30
147	Migration20251028172715	2026-02-19 13:40:55.893591+05:30
148	Migration20251121123942	2026-02-19 13:40:55.893591+05:30
149	Migration20251121150408	2026-02-19 13:40:55.893591+05:30
150	Migration20231228143900	2026-02-19 13:40:56.500977+05:30
151	Migration20241206101446	2026-02-19 13:40:56.500977+05:30
152	Migration20250128174331	2026-02-19 13:40:56.500977+05:30
153	Migration20250505092459	2026-02-19 13:40:56.500977+05:30
154	Migration20250819104213	2026-02-19 13:40:56.500977+05:30
155	Migration20250819110924	2026-02-19 13:40:56.500977+05:30
156	Migration20250908080305	2026-02-19 13:40:56.500977+05:30
\.


--
-- Data for Name: notification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notification (id, "to", channel, template, data, trigger_type, resource_id, resource_type, receiver_id, original_notification_id, idempotency_key, external_id, provider_id, created_at, updated_at, deleted_at, status, "from", provider_data) FROM stdin;
\.


--
-- Data for Name: notification_provider; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notification_provider (id, handle, name, is_enabled, channels, created_at, updated_at, deleted_at) FROM stdin;
local	local	local	t	{feed}	2026-02-19 13:41:02.477+05:30	2026-02-19 13:41:02.477+05:30	\N
\.


--
-- Data for Name: order; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."order" (id, region_id, display_id, customer_id, version, sales_channel_id, status, is_draft_order, email, currency_code, shipping_address_id, billing_address_id, no_notification, metadata, created_at, updated_at, deleted_at, canceled_at, custom_display_id, locale) FROM stdin;
order_01KHWZ6QH9TZ6W1N96BK7K72CW	reg_01KHTKFY0KFEBQMJJMD734XVS0	2	cus_01KHTPY41MVZPW7MHG4WCR9SWP	4	sc_01KHTF8JGN9HZWVEK942B6AAGQ	pending	f	chetan.novarsis@gmail.com	inr	ordaddr_01KHWZ6QH68RD0J93AA4DA2XYK	ordaddr_01KHWZ6QH5GEF1MPSPGWVDTJDT	f	\N	2026-02-20 12:58:38.443+05:30	2026-02-20 14:24:49.943+05:30	\N	\N	\N	\N
order_01KHTRQT2HA75SF9N6K445X41V	reg_01KHTKFY0KFEBQMJJMD734XVS0	1	cus_01KHTPY41MVZPW7MHG4WCR9SWP	2	sc_01KHTF8JGN9HZWVEK942B6AAGQ	pending	f	chetan.novarsis@gmail.com	inr	ordaddr_01KHTRQT2C5CYH1TD6EPX312MY	ordaddr_01KHTRQT2CYJQDFXC5HX0E9E6A	f	\N	2026-02-19 16:27:09.207+05:30	2026-02-20 17:56:40.61+05:30	\N	\N	\N	\N
order_01KJ010SJHRQ62VG9NA9H3ZA55	reg_01KHTKFY0KFEBQMJJMD734XVS0	3	cus_01KHTPY41MVZPW7MHG4WCR9SWP	1	sc_01KHTF8JGN9HZWVEK942B6AAGQ	pending	f	chetan.novarsis@gmail.com	inr	ordaddr_01KJ010SJD96KM1F53WFPSFP8W	ordaddr_01KJ010SJDS98SD9HFMQEXNERS	f	\N	2026-02-21 17:28:04.371+05:30	2026-02-21 17:28:04.371+05:30	\N	\N	\N	\N
\.


--
-- Data for Name: order_address; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_address (id, customer_id, company, first_name, last_name, address_1, address_2, city, country_code, province, postal_code, phone, metadata, created_at, updated_at, deleted_at) FROM stdin;
ordaddr_01KHTRQT2CYJQDFXC5HX0E9E6A	\N		chetan	tikkal	abcd		bihar	in	jharkhand	121212	1234567891	\N	2026-02-19 16:26:17.529+05:30	2026-02-19 16:26:17.529+05:30	\N
ordaddr_01KHTRQT2C5CYH1TD6EPX312MY	\N		chetan	tikkal	abcd		bihar	in	jharkhand	121212	1234567891	\N	2026-02-19 16:26:17.529+05:30	2026-02-19 16:26:17.529+05:30	\N
ordaddr_01KHWZ6QH5GEF1MPSPGWVDTJDT	\N		chetan	tikkal	abcd		bihar	in	dsads	121211		\N	2026-02-20 12:58:01.356+05:30	2026-02-20 12:58:01.356+05:30	\N
ordaddr_01KHWZ6QH68RD0J93AA4DA2XYK	\N		chetan	tikkal	abcd		bihar	in	dsads	121211		\N	2026-02-20 12:58:01.356+05:30	2026-02-20 12:58:01.356+05:30	\N
ordaddr_01KJ010SJDS98SD9HFMQEXNERS	\N		chetan	tikkal	sdgsd	af	indore	in	mp	121212	7771454788	\N	2026-02-21 17:26:20.131+05:30	2026-02-21 17:26:20.131+05:30	\N
ordaddr_01KJ010SJD96KM1F53WFPSFP8W	\N		chetan	tikkal	sdgsd	af	indore	in	mp	121212	7771454788	\N	2026-02-21 17:26:20.131+05:30	2026-02-21 17:26:20.131+05:30	\N
\.


--
-- Data for Name: order_cart; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_cart (order_id, cart_id, id, created_at, updated_at, deleted_at) FROM stdin;
order_01KHTRQT2HA75SF9N6K445X41V	cart_01KHTRMH8QJQPS9T5RDARZJ2TA	ordercart_01KHTRQT615MTX271CDJXBWFM5	2026-02-19 16:27:09.313166+05:30	2026-02-19 16:27:09.313166+05:30	\N
order_01KHWZ6QH9TZ6W1N96BK7K72CW	cart_01KHWZ4ZDV1H2VQMVDT69T1JAX	ordercart_01KHWZ6QMBGK0TM0EK98ZY2Q51	2026-02-20 12:58:38.539377+05:30	2026-02-20 12:58:38.539377+05:30	\N
order_01KJ010SJHRQ62VG9NA9H3ZA55	cart_01KJ00X27TJN0NCJBRFSTM050G	ordercart_01KJ010SNV76H7KW1TBK1NDYF6	2026-02-21 17:28:04.476142+05:30	2026-02-21 17:28:04.476142+05:30	\N
\.


--
-- Data for Name: order_change; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_change (id, order_id, version, description, status, internal_note, created_by, requested_by, requested_at, confirmed_by, confirmed_at, declined_by, declined_reason, metadata, declined_at, canceled_by, canceled_at, created_at, updated_at, change_type, deleted_at, return_id, claim_id, exchange_id, carry_over_promotions) FROM stdin;
ordch_01KHX3ZTB23793FWEJX2RHATW2	order_01KHWZ6QH9TZ6W1N96BK7K72CW	2	\N	confirmed	\N	\N	\N	\N	\N	2026-02-20 14:22:14.841+05:30	\N	\N	\N	\N	\N	\N	2026-02-20 14:22:14.819+05:30	2026-02-20 14:22:14.844+05:30	\N	\N	\N	\N	\N	\N
ordch_01KHX42FWTTJ82W58780C760YP	order_01KHWZ6QH9TZ6W1N96BK7K72CW	3	\N	confirmed	\N	\N	\N	\N	\N	2026-02-20 14:23:42.441+05:30	\N	\N	\N	\N	\N	\N	2026-02-20 14:23:42.427+05:30	2026-02-20 14:23:42.446+05:30	\N	\N	\N	\N	\N	\N
ordch_01KHX44HRGE9NA1NM0XEDA8H53	order_01KHWZ6QH9TZ6W1N96BK7K72CW	4	\N	confirmed	\N	\N	\N	\N	\N	2026-02-20 14:24:49.882+05:30	\N	\N	\N	\N	\N	\N	2026-02-20 14:24:49.873+05:30	2026-02-20 14:24:49.884+05:30	\N	\N	\N	\N	\N	\N
ordch_01KHXG8EGH8S2ZP241MRKBT8Q5	order_01KHTRQT2HA75SF9N6K445X41V	2	\N	confirmed	\N	\N	\N	\N	\N	2026-02-20 17:56:40.553+05:30	\N	\N	\N	\N	\N	\N	2026-02-20 17:56:40.53+05:30	2026-02-20 17:56:40.557+05:30	\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: order_change_action; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_change_action (id, order_id, version, ordering, order_change_id, reference, reference_id, action, details, amount, raw_amount, internal_note, applied, created_at, updated_at, deleted_at, return_id, claim_id, exchange_id) FROM stdin;
ordchact_01KHX3ZTB2AVC0TRS12ZQJ9KZ9	order_01KHWZ6QH9TZ6W1N96BK7K72CW	2	1	ordch_01KHX3ZTB23793FWEJX2RHATW2	fulfillment	ful_01KHX3ZT8N42TSPQFA542A90RK	FULFILL_ITEM	{"quantity": 1, "reference_id": "ordli_01KHWZ6QHAXPSPDF5Z6WBM5A8K"}	\N	\N	\N	t	2026-02-20 14:22:14.819+05:30	2026-02-20 14:22:14.874+05:30	\N	\N	\N	\N
ordchact_01KHX42FWT7AQF2XP3WC1A3DVV	order_01KHWZ6QH9TZ6W1N96BK7K72CW	3	2	ordch_01KHX42FWTTJ82W58780C760YP	fulfillment	ful_01KHX3ZT8N42TSPQFA542A90RK	SHIP_ITEM	{"quantity": "1", "reference_id": "ordli_01KHWZ6QHAXPSPDF5Z6WBM5A8K"}	\N	\N	\N	t	2026-02-20 14:23:42.427+05:30	2026-02-20 14:23:42.49+05:30	\N	\N	\N	\N
ordchact_01KHX44HRGZ6GVB56GG4P1YQ01	order_01KHWZ6QH9TZ6W1N96BK7K72CW	4	3	ordch_01KHX44HRGE9NA1NM0XEDA8H53	fulfillment	ful_01KHX3ZT8N42TSPQFA542A90RK	DELIVER_ITEM	{"quantity": "1", "reference_id": "ordli_01KHWZ6QHAXPSPDF5Z6WBM5A8K"}	\N	\N	\N	t	2026-02-20 14:24:49.873+05:30	2026-02-20 14:24:49.944+05:30	\N	\N	\N	\N
ordchact_01KHXG8EGHQGAZSKM2KPH5B4B0	order_01KHTRQT2HA75SF9N6K445X41V	2	4	ordch_01KHXG8EGH8S2ZP241MRKBT8Q5	fulfillment	ful_01KHXG8EE2Q9D9ANXE45RG3JXH	FULFILL_ITEM	{"quantity": 1, "reference_id": "ordli_01KHTRQT2KY54K00QSF4W0ZWKS"}	\N	\N	\N	t	2026-02-20 17:56:40.53+05:30	2026-02-20 17:56:40.61+05:30	\N	\N	\N	\N
\.


--
-- Data for Name: order_claim; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_claim (id, order_id, return_id, order_version, display_id, type, no_notification, refund_amount, raw_refund_amount, metadata, created_at, updated_at, deleted_at, canceled_at, created_by) FROM stdin;
\.


--
-- Data for Name: order_claim_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_claim_item (id, claim_id, item_id, is_additional_item, reason, quantity, raw_quantity, note, metadata, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: order_claim_item_image; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_claim_item_image (id, claim_item_id, url, metadata, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: order_credit_line; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_credit_line (id, order_id, reference, reference_id, amount, raw_amount, metadata, created_at, updated_at, deleted_at, version) FROM stdin;
\.


--
-- Data for Name: order_exchange; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_exchange (id, order_id, return_id, order_version, display_id, no_notification, allow_backorder, difference_due, raw_difference_due, metadata, created_at, updated_at, deleted_at, canceled_at, created_by) FROM stdin;
\.


--
-- Data for Name: order_exchange_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_exchange_item (id, exchange_id, item_id, quantity, raw_quantity, note, metadata, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: order_fulfillment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_fulfillment (order_id, fulfillment_id, id, created_at, updated_at, deleted_at) FROM stdin;
order_01KHWZ6QH9TZ6W1N96BK7K72CW	ful_01KHX3ZT8N42TSPQFA542A90RK	ordful_01KHX3ZTAKB1NSN0393CD24WZN	2026-02-20 14:22:14.800497+05:30	2026-02-20 14:22:14.800497+05:30	\N
order_01KHTRQT2HA75SF9N6K445X41V	ful_01KHXG8EE2Q9D9ANXE45RG3JXH	ordful_01KHXG8EG0R0YSK78PJ8BJA2Q5	2026-02-20 17:56:40.506131+05:30	2026-02-20 17:56:40.506131+05:30	\N
\.


--
-- Data for Name: order_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_item (id, order_id, version, item_id, quantity, raw_quantity, fulfilled_quantity, raw_fulfilled_quantity, shipped_quantity, raw_shipped_quantity, return_requested_quantity, raw_return_requested_quantity, return_received_quantity, raw_return_received_quantity, return_dismissed_quantity, raw_return_dismissed_quantity, written_off_quantity, raw_written_off_quantity, metadata, created_at, updated_at, deleted_at, delivered_quantity, raw_delivered_quantity, unit_price, raw_unit_price, compare_at_unit_price, raw_compare_at_unit_price) FROM stdin;
orditem_01KHTRQT2MPV6A5BNVKMKQR30X	order_01KHTRQT2HA75SF9N6K445X41V	1	ordli_01KHTRQT2KY54K00QSF4W0ZWKS	1	{"value": "1", "precision": 20}	0	{"value": "0", "precision": 20}	0	{"value": "0", "precision": 20}	0	{"value": "0", "precision": 20}	0	{"value": "0", "precision": 20}	0	{"value": "0", "precision": 20}	0	{"value": "0", "precision": 20}	\N	2026-02-19 16:27:09.207+05:30	2026-02-19 16:27:09.208+05:30	\N	0	{"value": "0", "precision": 20}	\N	\N	\N	\N
orditem_01KHWZ6QHAX63RXFE4YJN4XZH9	order_01KHWZ6QH9TZ6W1N96BK7K72CW	1	ordli_01KHWZ6QHAXPSPDF5Z6WBM5A8K	1	{"value": "1", "precision": 20}	0	{"value": "0", "precision": 20}	0	{"value": "0", "precision": 20}	0	{"value": "0", "precision": 20}	0	{"value": "0", "precision": 20}	0	{"value": "0", "precision": 20}	0	{"value": "0", "precision": 20}	\N	2026-02-20 12:58:38.444+05:30	2026-02-20 12:58:38.444+05:30	\N	0	{"value": "0", "precision": 20}	\N	\N	\N	\N
orditem_01KHX3ZTCK2PC6573DTP78V7X2	order_01KHWZ6QH9TZ6W1N96BK7K72CW	2	ordli_01KHWZ6QHAXPSPDF5Z6WBM5A8K	1	{"value": "1", "precision": 20}	1	{"value": "1", "precision": 20}	0	{"value": "0", "precision": 20}	0	{"value": "0", "precision": 20}	0	{"value": "0", "precision": 20}	0	{"value": "0", "precision": 20}	0	{"value": "0", "precision": 20}	\N	2026-02-20 14:22:14.873+05:30	2026-02-20 14:22:14.873+05:30	\N	0	{"value": "0", "precision": 20}	1800	{"value": "1800", "precision": 20}	\N	\N
orditem_01KHX42FYGS7DS4JJGVX81Y98G	order_01KHWZ6QH9TZ6W1N96BK7K72CW	3	ordli_01KHWZ6QHAXPSPDF5Z6WBM5A8K	1	{"value": "1", "precision": 20}	1	{"value": "1", "precision": 20}	1	{"value": "1", "precision": 20}	0	{"value": "0", "precision": 20}	0	{"value": "0", "precision": 20}	0	{"value": "0", "precision": 20}	0	{"value": "0", "precision": 20}	\N	2026-02-20 14:23:42.49+05:30	2026-02-20 14:23:42.49+05:30	\N	0	{"value": "0", "precision": 20}	1800	{"value": "1800", "precision": 20}	\N	\N
orditem_01KHX44HSXHGBS0MHXMSRZQAWG	order_01KHWZ6QH9TZ6W1N96BK7K72CW	4	ordli_01KHWZ6QHAXPSPDF5Z6WBM5A8K	1	{"value": "1", "precision": 20}	1	{"value": "1", "precision": 20}	1	{"value": "1", "precision": 20}	0	{"value": "0", "precision": 20}	0	{"value": "0", "precision": 20}	0	{"value": "0", "precision": 20}	0	{"value": "0", "precision": 20}	\N	2026-02-20 14:24:49.943+05:30	2026-02-20 14:24:49.943+05:30	\N	1	{"value": "1", "precision": 20}	1800	{"value": "1800", "precision": 20}	\N	\N
orditem_01KHXG8EJSHS7638VMTZ1GZ50N	order_01KHTRQT2HA75SF9N6K445X41V	2	ordli_01KHTRQT2KY54K00QSF4W0ZWKS	1	{"value": "1", "precision": 20}	1	{"value": "1", "precision": 20}	0	{"value": "0", "precision": 20}	0	{"value": "0", "precision": 20}	0	{"value": "0", "precision": 20}	0	{"value": "0", "precision": 20}	0	{"value": "0", "precision": 20}	\N	2026-02-20 17:56:40.609+05:30	2026-02-20 17:56:40.609+05:30	\N	0	{"value": "0", "precision": 20}	180	{"value": "180", "precision": 20}	\N	\N
orditem_01KJ010SJJB153034TCSB7RZZH	order_01KJ010SJHRQ62VG9NA9H3ZA55	1	ordli_01KJ010SJJ557WCHTFST6X7NMH	1	{"value": "1", "precision": 20}	0	{"value": "0", "precision": 20}	0	{"value": "0", "precision": 20}	0	{"value": "0", "precision": 20}	0	{"value": "0", "precision": 20}	0	{"value": "0", "precision": 20}	0	{"value": "0", "precision": 20}	\N	2026-02-21 17:28:04.372+05:30	2026-02-21 17:28:04.372+05:30	\N	0	{"value": "0", "precision": 20}	\N	\N	\N	\N
\.


--
-- Data for Name: order_line_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_line_item (id, totals_id, title, subtitle, thumbnail, variant_id, product_id, product_title, product_description, product_subtitle, product_type, product_collection, product_handle, variant_sku, variant_barcode, variant_title, variant_option_values, requires_shipping, is_discountable, is_tax_inclusive, compare_at_unit_price, raw_compare_at_unit_price, unit_price, raw_unit_price, metadata, created_at, updated_at, deleted_at, is_custom_price, product_type_id, is_giftcard) FROM stdin;
ordli_01KHTRQT2KY54K00QSF4W0ZWKS	\N	Multigrain Atta	1 Pack	http://localhost:9000/static/1771496164792-image-1771495656335.png	variant_01KHTKFYBZ5CC78V7V83N6PEYA	prod_01KHTKFY8VDC4G7YD60DP3RVC1	Multigrain Atta	Healthy Multigrain Atta	\N	\N	\N	multigrain-atta	MULTI-ATTA-1	\N	1 Pack	\N	t	t	f	\N	\N	180	{"value": "180", "precision": 20}	{}	2026-02-19 16:27:09.207+05:30	2026-02-19 16:27:09.207+05:30	\N	f	\N	f
ordli_01KHWZ6QHAXPSPDF5Z6WBM5A8K	\N	Ghee	500g Bottle	http://localhost:9000/static/1771569404776-image-1771569324022.png	variant_01KHTKFYC1T7GYJAPEK3GBX2HY	prod_01KHTKFY8WJSF8SQ05MV2PS7J8	Ghee	Pure Ghee 500g Bottle	\N	\N	\N	ghee-500	GHEE-500	\N	500g Bottle	\N	t	t	f	\N	\N	1800	{"value": "1800", "precision": 20}	{}	2026-02-20 12:58:38.444+05:30	2026-02-20 12:58:38.444+05:30	\N	f	\N	f
ordli_01KJ010SJJ557WCHTFST6X7NMH	\N	Multigrain Atta	1 Pack	http://localhost:9000/static/1771496164803-image-1771495992704.png	variant_01KHTKFYBZ5CC78V7V83N6PEYA	prod_01KHTKFY8VDC4G7YD60DP3RVC1	Multigrain Atta	Healthy Multigrain Atta	\N	\N	\N	multigrain-atta	MULTI-ATTA-1	\N	1 Pack	\N	t	t	f	\N	\N	180	{"value": "180", "precision": 20}	{}	2026-02-21 17:28:04.372+05:30	2026-02-21 17:28:04.372+05:30	\N	f	\N	f
\.


--
-- Data for Name: order_line_item_adjustment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_line_item_adjustment (id, description, promotion_id, code, amount, raw_amount, provider_id, created_at, updated_at, item_id, deleted_at, is_tax_inclusive, version) FROM stdin;
\.


--
-- Data for Name: order_line_item_tax_line; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_line_item_tax_line (id, description, tax_rate_id, code, rate, raw_rate, provider_id, created_at, updated_at, item_id, deleted_at) FROM stdin;
\.


--
-- Data for Name: order_payment_collection; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_payment_collection (order_id, payment_collection_id, id, created_at, updated_at, deleted_at) FROM stdin;
order_01KHTRQT2HA75SF9N6K445X41V	pay_col_01KHTRPDGYYS87T627E490057T	ordpay_01KHTRQT658SDW31M4KP676ZST	2026-02-19 16:27:09.313221+05:30	2026-02-19 16:27:09.313221+05:30	\N
order_01KHWZ6QH9TZ6W1N96BK7K72CW	pay_col_01KHWZ5SBEMSAMSJ80RKPRAF1Z	ordpay_01KHWZ6QMJAZ8NHZB1DJHW2051	2026-02-20 12:58:38.539416+05:30	2026-02-20 12:58:38.539416+05:30	\N
order_01KJ010SJHRQ62VG9NA9H3ZA55	pay_col_01KJ00XTHEGSB1RBX6SA1HK8FT	ordpay_01KJ010SNX9YCDQKV83JYTMWGN	2026-02-21 17:28:04.476212+05:30	2026-02-21 17:28:04.476212+05:30	\N
\.


--
-- Data for Name: order_promotion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_promotion (order_id, promotion_id, id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: order_shipping; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_shipping (id, order_id, version, shipping_method_id, created_at, updated_at, deleted_at, return_id, claim_id, exchange_id) FROM stdin;
ordspmv_01KHTRQT2H9ZE0DJ4DJX7EKGCX	order_01KHTRQT2HA75SF9N6K445X41V	1	ordsm_01KHTRQT2H98A381BQ39465GZQ	2026-02-19 16:27:09.209+05:30	2026-02-19 16:27:09.209+05:30	\N	\N	\N	\N
ordspmv_01KHWZ6QH8H68HDYRR7RZFVBA7	order_01KHWZ6QH9TZ6W1N96BK7K72CW	1	ordsm_01KHWZ6QH88RSBAP7VYNVDX8SY	2026-02-20 12:58:38.444+05:30	2026-02-20 12:58:38.444+05:30	\N	\N	\N	\N
ordspmv_01KHX3ZTCKX1QKXDMZRF3AS0FM	order_01KHWZ6QH9TZ6W1N96BK7K72CW	2	ordsm_01KHWZ6QH88RSBAP7VYNVDX8SY	2026-02-20 12:58:38.444+05:30	2026-02-20 12:58:38.444+05:30	\N	\N	\N	\N
ordspmv_01KHX42FYHZ0J354AGF41FT9H5	order_01KHWZ6QH9TZ6W1N96BK7K72CW	3	ordsm_01KHWZ6QH88RSBAP7VYNVDX8SY	2026-02-20 12:58:38.444+05:30	2026-02-20 12:58:38.444+05:30	\N	\N	\N	\N
ordspmv_01KHX44HSX3J2NSV6QGCHR5SP4	order_01KHWZ6QH9TZ6W1N96BK7K72CW	4	ordsm_01KHWZ6QH88RSBAP7VYNVDX8SY	2026-02-20 12:58:38.444+05:30	2026-02-20 12:58:38.444+05:30	\N	\N	\N	\N
ordspmv_01KHXG8EJSF913TA41963SZSEF	order_01KHTRQT2HA75SF9N6K445X41V	2	ordsm_01KHTRQT2H98A381BQ39465GZQ	2026-02-19 16:27:09.209+05:30	2026-02-19 16:27:09.209+05:30	\N	\N	\N	\N
ordspmv_01KJ010SJHW2DJ53FS9J35ZNY6	order_01KJ010SJHRQ62VG9NA9H3ZA55	1	ordsm_01KJ010SJHHKC2QDFH99GZXBZ6	2026-02-21 17:28:04.373+05:30	2026-02-21 17:28:04.373+05:30	\N	\N	\N	\N
\.


--
-- Data for Name: order_shipping_method; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_shipping_method (id, name, description, amount, raw_amount, is_tax_inclusive, shipping_option_id, data, metadata, created_at, updated_at, deleted_at, is_custom_amount) FROM stdin;
ordsm_01KHTRQT2H98A381BQ39465GZQ	Standard Shipping	\N	50	{"value": "50", "precision": 20}	f	so_01KHTKFY58XNN3M9WYSRN52W9P	{}	\N	2026-02-19 16:27:09.208+05:30	2026-02-19 16:27:09.208+05:30	\N	f
ordsm_01KHWZ6QH88RSBAP7VYNVDX8SY	Standard Shipping	\N	0	{"value": "0", "precision": 20}	f	so_01KHTKFY58XNN3M9WYSRN52W9P	{}	\N	2026-02-20 12:58:38.444+05:30	2026-02-20 12:58:38.444+05:30	\N	f
ordsm_01KJ010SJHHKC2QDFH99GZXBZ6	Standard Shipping	\N	0	{"value": "0", "precision": 20}	f	so_01KHTKFY58XNN3M9WYSRN52W9P	{}	\N	2026-02-21 17:28:04.372+05:30	2026-02-21 17:28:04.372+05:30	\N	f
\.


--
-- Data for Name: order_shipping_method_adjustment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_shipping_method_adjustment (id, description, promotion_id, code, amount, raw_amount, provider_id, created_at, updated_at, shipping_method_id, deleted_at) FROM stdin;
\.


--
-- Data for Name: order_shipping_method_tax_line; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_shipping_method_tax_line (id, description, tax_rate_id, code, rate, raw_rate, provider_id, created_at, updated_at, shipping_method_id, deleted_at) FROM stdin;
\.


--
-- Data for Name: order_summary; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_summary (id, order_id, version, totals, created_at, updated_at, deleted_at) FROM stdin;
ordsum_01KHWZ6QH7BG7VYN0BMEZB97XA	order_01KHWZ6QH9TZ6W1N96BK7K72CW	1	{"paid_total": 0, "raw_paid_total": {"value": "0", "precision": 20}, "refunded_total": 0, "accounting_total": 1800, "credit_line_total": 0, "transaction_total": 0, "pending_difference": 1800, "raw_refunded_total": {"value": "0", "precision": 20}, "current_order_total": 1800, "original_order_total": 1800, "raw_accounting_total": {"value": "1800", "precision": 20}, "raw_credit_line_total": {"value": "0", "precision": 20}, "raw_transaction_total": {"value": "0", "precision": 20}, "raw_pending_difference": {"value": "1800", "precision": 20}, "raw_current_order_total": {"value": "1800", "precision": 20}, "raw_original_order_total": {"value": "1800", "precision": 20}}	2026-02-20 12:58:38.444+05:30	2026-02-20 12:58:38.444+05:30	\N
ordsum_01KHX3ZTCKA5NJGNX6TE9Q49ME	order_01KHWZ6QH9TZ6W1N96BK7K72CW	2	{"paid_total": 0, "raw_paid_total": {"value": "0", "precision": 20}, "refunded_total": 0, "accounting_total": 1800, "credit_line_total": 0, "transaction_total": 0, "pending_difference": 1800, "raw_refunded_total": {"value": "0", "precision": 20}, "current_order_total": 1800, "original_order_total": 1800, "raw_accounting_total": {"value": "1800", "precision": 20}, "raw_credit_line_total": {"value": "0", "precision": 20}, "raw_transaction_total": {"value": "0", "precision": 20}, "raw_pending_difference": {"value": "1800", "precision": 20}, "raw_current_order_total": {"value": "1800", "precision": 20}, "raw_original_order_total": {"value": "1800", "precision": 20}}	2026-02-20 14:22:14.874+05:30	2026-02-20 14:22:14.874+05:30	\N
ordsum_01KHX42FYGQ7ZVRJC5H0FVYW6W	order_01KHWZ6QH9TZ6W1N96BK7K72CW	3	{"paid_total": 0, "raw_paid_total": {"value": "0", "precision": 20}, "refunded_total": 0, "accounting_total": 1800, "credit_line_total": 0, "transaction_total": 0, "pending_difference": 1800, "raw_refunded_total": {"value": "0", "precision": 20}, "current_order_total": 1800, "original_order_total": 1800, "raw_accounting_total": {"value": "1800", "precision": 20}, "raw_credit_line_total": {"value": "0", "precision": 20}, "raw_transaction_total": {"value": "0", "precision": 20}, "raw_pending_difference": {"value": "1800", "precision": 20}, "raw_current_order_total": {"value": "1800", "precision": 20}, "raw_original_order_total": {"value": "1800", "precision": 20}}	2026-02-20 14:23:42.49+05:30	2026-02-20 14:23:42.49+05:30	\N
ordsum_01KHTRQT2F901DRX2BV5B2RMTG	order_01KHTRQT2HA75SF9N6K445X41V	1	{"paid_total": 230, "raw_paid_total": {"value": "230", "precision": 20}, "refunded_total": 0, "accounting_total": 230, "credit_line_total": 0, "transaction_total": 230, "pending_difference": 0, "raw_refunded_total": {"value": "0", "precision": 20}, "current_order_total": 230, "original_order_total": 230, "raw_accounting_total": {"value": "230", "precision": 20}, "raw_credit_line_total": {"value": "0", "precision": 20}, "raw_transaction_total": {"value": "230", "precision": 20}, "raw_pending_difference": {"value": "0", "precision": 20}, "raw_current_order_total": {"value": "230", "precision": 20}, "raw_original_order_total": {"value": "230", "precision": 20}}	2026-02-19 16:27:09.208+05:30	2026-02-20 15:23:28.053+05:30	\N
ordsum_01KHX44HSX53BATWVV28Q00RN0	order_01KHWZ6QH9TZ6W1N96BK7K72CW	4	{"paid_total": 1800, "raw_paid_total": {"value": "1800", "precision": 20}, "refunded_total": 0, "accounting_total": 1800, "credit_line_total": 0, "transaction_total": 1800, "pending_difference": 0, "raw_refunded_total": {"value": "0", "precision": 20}, "current_order_total": 1800, "original_order_total": 1800, "raw_accounting_total": {"value": "1800", "precision": 20}, "raw_credit_line_total": {"value": "0", "precision": 20}, "raw_transaction_total": {"value": "1800", "precision": 20}, "raw_pending_difference": {"value": "0", "precision": 20}, "raw_current_order_total": {"value": "1800", "precision": 20}, "raw_original_order_total": {"value": "1800", "precision": 20}}	2026-02-20 14:24:49.943+05:30	2026-02-20 15:27:30.183+05:30	\N
ordsum_01KHXG8EJSKR7A0Y508GPJQVNW	order_01KHTRQT2HA75SF9N6K445X41V	2	{"paid_total": 230, "raw_paid_total": {"value": "230", "precision": 20}, "refunded_total": 0, "accounting_total": 230, "credit_line_total": 0, "transaction_total": 230, "pending_difference": 0, "raw_refunded_total": {"value": "0", "precision": 20}, "current_order_total": 230, "original_order_total": 230, "raw_accounting_total": {"value": "230", "precision": 20}, "raw_credit_line_total": {"value": "0", "precision": 20}, "raw_transaction_total": {"value": "230", "precision": 20}, "raw_pending_difference": {"value": "0", "precision": 20}, "raw_current_order_total": {"value": "230", "precision": 20}, "raw_original_order_total": {"value": "230", "precision": 20}}	2026-02-20 17:56:40.61+05:30	2026-02-20 17:56:40.61+05:30	\N
ordsum_01KJ010SJG9BYAM86ZVBYXVJA1	order_01KJ010SJHRQ62VG9NA9H3ZA55	1	{"paid_total": 180, "raw_paid_total": {"value": "180", "precision": 20}, "refunded_total": 0, "accounting_total": 180, "credit_line_total": 0, "transaction_total": 180, "pending_difference": 0, "raw_refunded_total": {"value": "0", "precision": 20}, "current_order_total": 180, "original_order_total": 180, "raw_accounting_total": {"value": "180", "precision": 20}, "raw_credit_line_total": {"value": "0", "precision": 20}, "raw_transaction_total": {"value": "180", "precision": 20}, "raw_pending_difference": {"value": "0", "precision": 20}, "raw_current_order_total": {"value": "180", "precision": 20}, "raw_original_order_total": {"value": "180", "precision": 20}}	2026-02-21 17:28:04.372+05:30	2026-02-21 17:28:05.505+05:30	\N
\.


--
-- Data for Name: order_transaction; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_transaction (id, order_id, version, amount, raw_amount, currency_code, reference, reference_id, created_at, updated_at, deleted_at, return_id, claim_id, exchange_id) FROM stdin;
ordtrx_01KHX7FXFDN22CW67BHGXWEZGK	order_01KHTRQT2HA75SF9N6K445X41V	1	230	{"value": "230", "precision": 20}	inr	capture	capt_01KHX7FW68PFJHJ4GX6M4FP574	2026-02-20 15:23:28.053+05:30	2026-02-20 15:23:28.053+05:30	\N	\N	\N	\N
ordtrx_01KHX7Q9XZTNPVPRVP9EDWPG3X	order_01KHWZ6QH9TZ6W1N96BK7K72CW	4	1800	{"value": "1800", "precision": 20}	inr	capture	capt_01KHX7Q8Q336E1CVF13SXKRRK5	2026-02-20 15:27:30.183+05:30	2026-02-20 15:27:30.183+05:30	\N	\N	\N	\N
ordtrx_01KJ010TNQ8RYT833XHC0NTB99	order_01KJ010SJHRQ62VG9NA9H3ZA55	1	180	{"value": "180", "precision": 20}	inr	capture	capt_01KJ010TKVEWXEC3NMXV1JGEKJ	2026-02-21 17:28:05.505+05:30	2026-02-21 17:28:05.505+05:30	\N	\N	\N	\N
\.


--
-- Data for Name: payment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payment (id, amount, raw_amount, currency_code, provider_id, data, created_at, updated_at, deleted_at, captured_at, canceled_at, payment_collection_id, payment_session_id, metadata) FROM stdin;
pay_01KHTRQT7MYVXCTRGH8PRJ1J72	230	{"value": "230", "precision": 20}	inr	pp_razorpay_razorpay	{"id": "pay_SHylj3SyGcHisM", "fee": 542, "tax": 82, "upi": {"vpa": "akfsdlk@okaxis", "flow": "collect"}, "vpa": "akfsdlk@okaxis", "bank": null, "email": "chetan.novarsis@gmail.com", "notes": {"address": "abcd"}, "amount": 23000, "entity": "payment", "method": "upi", "status": "captured", "wallet": null, "card_id": null, "contact": "+917845784578", "receipt": "order_1771498583684", "attempts": 0, "captured": true, "currency": "INR", "offer_id": null, "order_id": "order_SHylCmLuCIGz4E", "amount_due": 23000, "created_at": 1771498613, "error_code": null, "error_step": null, "invoice_id": null, "amount_paid": 0, "description": "Order Payment", "error_reason": null, "error_source": null, "acquirer_data": {"rrn": "421965526481", "upi_transaction_id": "A106B9EAFBC5BBEC81BB5CF8DBB415F5"}, "international": false, "refund_status": null, "amount_refunded": 0, "error_description": null, "razorpay_payment_id": "pay_SHylj3SyGcHisM", "razorpay_payment_captured": true}	2026-02-19 16:27:09.364+05:30	2026-02-20 15:23:27.994+05:30	\N	2026-02-20 15:23:27.978+05:30	\N	pay_col_01KHTRPDGYYS87T627E490057T	payses_01KHTRPDM0T37H9HHDVHCF1SZW	\N
pay_01KHWZ6QNHQ82N9WJFA9TEN43M	1800	{"value": "1800", "precision": 20}	inr	pp_razorpay_razorpay	{"id": "pay_SIJkbNN9ljQXMP", "fee": 4248, "tax": 648, "upi": {"vpa": "asdf@ybl", "flow": "collect"}, "vpa": "asdf@ybl", "bank": null, "email": "chetan.novarsis@gmail.com", "notes": {"address": "abcd"}, "amount": 180000, "entity": "payment", "method": "upi", "status": "captured", "wallet": null, "card_id": null, "contact": "+917845784578", "receipt": "order_1771572487749", "attempts": 0, "captured": true, "currency": "INR", "offer_id": null, "order_id": "order_SIJkKrbkYs2wuX", "amount_due": 180000, "created_at": 1771572503, "error_code": null, "error_step": null, "invoice_id": null, "amount_paid": 0, "description": "Order Payment", "error_reason": null, "error_source": null, "acquirer_data": {"rrn": "616634243102", "upi_transaction_id": "391CFF639E567BD692F9B396C9732EE7"}, "international": false, "refund_status": null, "amount_refunded": 0, "error_description": null, "razorpay_payment_id": "pay_SIJkbNN9ljQXMP", "razorpay_payment_captured": true}	2026-02-20 12:58:38.577+05:30	2026-02-20 15:27:30.124+05:30	\N	2026-02-20 15:27:30.092+05:30	\N	pay_col_01KHWZ5SBEMSAMSJ80RKPRAF1Z	payses_01KHWZ5SHW08F0M249J77D4HRF	\N
pay_01KJ010TK7H1ZKCJGVEBTG5DDZ	180	{"value": "180", "precision": 20}	inr	pp_razorpay_razorpay	{"id": "pay_SImsFwMFl9fDEE", "fee": 424, "tax": 64, "upi": {"vpa": "asdf@okaxis", "flow": "collect"}, "vpa": "asdf@okaxis", "bank": null, "email": "chetan.novarsis@gmail.com", "notes": {"address": "sdgsd"}, "amount": 18000, "entity": "payment", "method": "upi", "status": "captured", "wallet": null, "card_id": null, "contact": "+917771454788", "receipt": "order_1771674987200", "attempts": 0, "captured": true, "currency": "INR", "offer_id": null, "order_id": "order_SImqtzEVcjcfFD", "amount_due": 18000, "created_at": 1771675064, "error_code": null, "error_step": null, "invoice_id": null, "amount_paid": 0, "description": "Order Payment", "error_reason": null, "error_source": null, "acquirer_data": {"rrn": "805442817767", "upi_transaction_id": "2C8704DED63B0062987A64CD29DB73CB"}, "international": false, "refund_status": null, "amount_refunded": 0, "error_description": null, "razorpay_payment_id": "pay_SImsFwMFl9fDEE", "razorpay_payment_status": "captured", "razorpay_payment_captured": true}	2026-02-21 17:28:05.415+05:30	2026-02-21 17:28:05.454+05:30	\N	2026-02-21 17:28:05.436+05:30	\N	pay_col_01KJ00XTHEGSB1RBX6SA1HK8FT	payses_01KJ00XTNSDCBM2E5A0XC7S066	\N
\.


--
-- Data for Name: payment_collection; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payment_collection (id, currency_code, amount, raw_amount, authorized_amount, raw_authorized_amount, captured_amount, raw_captured_amount, refunded_amount, raw_refunded_amount, created_at, updated_at, deleted_at, completed_at, status, metadata) FROM stdin;
pay_col_01KHTRPDGYYS87T627E490057T	inr	230	{"value": "230", "precision": 20}	230	{"value": "230", "precision": 20}	230	{"value": "230", "precision": 20}	0	{"value": "0", "precision": 20}	2026-02-19 16:26:23.583+05:30	2026-02-20 15:23:28.018+05:30	\N	2026-02-20 15:23:28.015+05:30	completed	\N
pay_col_01KHWZ5SBEMSAMSJ80RKPRAF1Z	inr	1800	{"value": "1800", "precision": 20}	1800	{"value": "1800", "precision": 20}	1800	{"value": "1800", "precision": 20}	0	{"value": "0", "precision": 20}	2026-02-20 12:58:07.534+05:30	2026-02-20 15:27:30.153+05:30	\N	2026-02-20 15:27:30.149+05:30	completed	\N
pay_col_01KHZAA5PK8S313TZR7K98YVD7	inr	1800	{"value": "1800", "precision": 20}	\N	\N	\N	\N	\N	\N	2026-02-21 10:51:14.452+05:30	2026-02-21 10:51:14.452+05:30	\N	\N	not_paid	\N
pay_col_01KJ00XTHEGSB1RBX6SA1HK8FT	inr	180	{"value": "180", "precision": 20}	180	{"value": "180", "precision": 20}	180	{"value": "180", "precision": 20}	0	{"value": "0", "precision": 20}	2026-02-21 17:26:27.054+05:30	2026-02-21 17:28:05.472+05:30	\N	2026-02-21 17:28:05.469+05:30	completed	\N
\.


--
-- Data for Name: payment_collection_payment_providers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payment_collection_payment_providers (payment_collection_id, payment_provider_id) FROM stdin;
\.


--
-- Data for Name: payment_provider; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payment_provider (id, is_enabled, created_at, updated_at, deleted_at) FROM stdin;
pp_razorpay_razorpay	t	2026-02-19 13:41:02.48+05:30	2026-02-19 13:41:02.48+05:30	\N
pp_system_default	t	2026-02-19 13:41:02.48+05:30	2026-02-19 13:41:02.48+05:30	\N
\.


--
-- Data for Name: payment_session; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payment_session (id, currency_code, amount, raw_amount, provider_id, data, context, status, authorized_at, payment_collection_id, metadata, created_at, updated_at, deleted_at) FROM stdin;
payses_01KHTRPDM0T37H9HHDVHCF1SZW	inr	230	{"value": "230", "precision": 20}	pp_razorpay_razorpay	{"id": "order_SHylCmLuCIGz4E", "notes": [], "amount": 23000, "entity": "order", "status": "created", "receipt": "order_1771498583684", "attempts": 0, "currency": "INR", "offer_id": null, "amount_due": 23000, "created_at": 1771498583, "amount_paid": 0}	{"customer": {"id": "cus_01KHTPY41MVZPW7MHG4WCR9SWP", "email": "chetan.novarsis@gmail.com", "phone": null, "metadata": null, "addresses": [], "last_name": "tikkal", "first_name": "chetan", "company_name": null, "account_holders": []}}	authorized	2026-02-19 16:27:09.361+05:30	pay_col_01KHTRPDGYYS87T627E490057T	{}	2026-02-19 16:26:23.68+05:30	2026-02-19 16:27:09.365+05:30	\N
payses_01KHWZ5SHW08F0M249J77D4HRF	inr	1800	{"value": "1800", "precision": 20}	pp_razorpay_razorpay	{"id": "order_SIJkKrbkYs2wuX", "notes": [], "amount": 180000, "entity": "order", "status": "created", "receipt": "order_1771572487749", "attempts": 0, "currency": "INR", "offer_id": null, "amount_due": 180000, "created_at": 1771572487, "amount_paid": 0}	{"customer": {"id": "cus_01KHTPY41MVZPW7MHG4WCR9SWP", "email": "chetan.novarsis@gmail.com", "phone": "7771824784", "metadata": {"wishlist": []}, "addresses": [], "last_name": "tikkal", "first_name": "chetandsdf", "company_name": null, "account_holders": []}}	authorized	2026-02-20 12:58:38.572+05:30	pay_col_01KHWZ5SBEMSAMSJ80RKPRAF1Z	{}	2026-02-20 12:58:07.741+05:30	2026-02-20 12:58:38.578+05:30	\N
payses_01KHZAA5T1F8GWZ6NV0QXRNDDY	inr	1800	{"value": "1800", "precision": 20}	pp_razorpay_razorpay	{"id": "order_SIg7QNGPZX7ecL", "notes": [], "amount": 180000, "entity": "order", "status": "created", "receipt": "order_1771651274567", "attempts": 0, "currency": "INR", "offer_id": null, "amount_due": 180000, "created_at": 1771651274, "amount_paid": 0}	{"customer": {"id": "cus_01KHTPY41MVZPW7MHG4WCR9SWP", "email": "chetan.novarsis@gmail.com", "phone": "7771824784", "metadata": {"wishlist": []}, "addresses": [{"id": "cuaddr_01KHWZ9V2625ARTESDPHBP80E0", "city": "indore", "phone": "7771454788", "company": "", "metadata": null, "province": "mp", "address_1": "sdgsd", "address_2": "af", "last_name": "tikkal", "created_at": "2026-02-20T07:30:20.359Z", "deleted_at": null, "first_name": "chetan", "updated_at": "2026-02-20T07:30:20.359Z", "customer_id": "cus_01KHTPY41MVZPW7MHG4WCR9SWP", "postal_code": "121212", "address_name": null, "country_code": "in", "is_default_billing": false, "is_default_shipping": true}, {"id": "cuaddr_01KHWZAE472K4DCS9BP1XFN7BN", "city": "indore", "phone": "1234567891", "company": "ad", "metadata": null, "province": "mp", "address_1": "asd", "address_2": "", "last_name": "adsf", "created_at": "2026-02-20T07:30:39.880Z", "deleted_at": null, "first_name": "adfasd", "updated_at": "2026-02-20T07:30:39.880Z", "customer_id": "cus_01KHTPY41MVZPW7MHG4WCR9SWP", "postal_code": "123123", "address_name": null, "country_code": "in", "is_default_billing": false, "is_default_shipping": false}], "last_name": "tikkal", "first_name": "chetandsdf", "company_name": null, "account_holders": [], "billing_address": {"id": "cuaddr_01KHWZ9V2625ARTESDPHBP80E0", "city": "indore", "phone": "7771454788", "company": "", "metadata": null, "province": "mp", "address_1": "sdgsd", "address_2": "af", "last_name": "tikkal", "created_at": "2026-02-20T07:30:20.359Z", "deleted_at": null, "first_name": "chetan", "updated_at": "2026-02-20T07:30:20.359Z", "customer_id": "cus_01KHTPY41MVZPW7MHG4WCR9SWP", "postal_code": "121212", "address_name": null, "country_code": "in", "is_default_billing": false, "is_default_shipping": true}}}	pending	\N	pay_col_01KHZAA5PK8S313TZR7K98YVD7	{}	2026-02-21 10:51:14.561+05:30	2026-02-21 10:51:14.869+05:30	\N
payses_01KJ00XTNSDCBM2E5A0XC7S066	inr	180	{"value": "180", "precision": 20}	pp_razorpay_razorpay	{"id": "pay_SImsFwMFl9fDEE", "fee": 424, "tax": 64, "upi": {"vpa": "asdf@okaxis", "flow": "collect"}, "vpa": "asdf@okaxis", "bank": null, "email": "chetan.novarsis@gmail.com", "notes": {"address": "sdgsd"}, "amount": 18000, "entity": "payment", "method": "upi", "status": "captured", "wallet": null, "card_id": null, "contact": "+917771454788", "receipt": "order_1771674987200", "attempts": 0, "captured": true, "currency": "INR", "offer_id": null, "order_id": "order_SImqtzEVcjcfFD", "amount_due": 18000, "created_at": 1771675064, "error_code": null, "error_step": null, "invoice_id": null, "amount_paid": 0, "description": "Order Payment", "error_reason": null, "error_source": null, "acquirer_data": {"rrn": "805442817767", "upi_transaction_id": "2C8704DED63B0062987A64CD29DB73CB"}, "international": false, "refund_status": null, "amount_refunded": 0, "error_description": null, "razorpay_payment_id": "pay_SImsFwMFl9fDEE", "razorpay_payment_status": "captured", "razorpay_payment_captured": true}	{"customer": {"id": "cus_01KHTPY41MVZPW7MHG4WCR9SWP", "email": "chetan.novarsis@gmail.com", "phone": "7771824784", "metadata": {"wishlist": []}, "addresses": [{"id": "cuaddr_01KHWZ9V2625ARTESDPHBP80E0", "city": "indore", "phone": "7771454788", "company": "", "metadata": null, "province": "mp", "address_1": "sdgsd", "address_2": "af", "last_name": "tikkal", "created_at": "2026-02-20T07:30:20.359Z", "deleted_at": null, "first_name": "chetan", "updated_at": "2026-02-20T07:30:20.359Z", "customer_id": "cus_01KHTPY41MVZPW7MHG4WCR9SWP", "postal_code": "121212", "address_name": null, "country_code": "in", "is_default_billing": false, "is_default_shipping": true}, {"id": "cuaddr_01KHWZAE472K4DCS9BP1XFN7BN", "city": "indore", "phone": "1234567891", "company": "ad", "metadata": null, "province": "mp", "address_1": "asd", "address_2": "", "last_name": "adsf", "created_at": "2026-02-20T07:30:39.880Z", "deleted_at": null, "first_name": "adfasd", "updated_at": "2026-02-20T07:30:39.880Z", "customer_id": "cus_01KHTPY41MVZPW7MHG4WCR9SWP", "postal_code": "123123", "address_name": null, "country_code": "in", "is_default_billing": false, "is_default_shipping": false}], "last_name": "tikkal", "first_name": "chetandsdf", "company_name": null, "account_holders": [], "billing_address": {"id": "cuaddr_01KHWZ9V2625ARTESDPHBP80E0", "city": "indore", "phone": "7771454788", "company": "", "metadata": null, "province": "mp", "address_1": "sdgsd", "address_2": "af", "last_name": "tikkal", "created_at": "2026-02-20T07:30:20.359Z", "deleted_at": null, "first_name": "chetan", "updated_at": "2026-02-20T07:30:20.359Z", "customer_id": "cus_01KHTPY41MVZPW7MHG4WCR9SWP", "postal_code": "121212", "address_name": null, "country_code": "in", "is_default_billing": false, "is_default_shipping": true}}}	authorized	2026-02-21 17:28:05.409+05:30	pay_col_01KJ00XTHEGSB1RBX6SA1HK8FT	{}	2026-02-21 17:26:27.193+05:30	2026-02-21 17:28:05.416+05:30	\N
\.


--
-- Data for Name: price; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.price (id, title, price_set_id, currency_code, raw_amount, rules_count, created_at, updated_at, deleted_at, price_list_id, amount, min_quantity, max_quantity, raw_min_quantity, raw_max_quantity) FROM stdin;
price_01KHTKFYDW6N8E40WVMWMPT9DG	\N	pset_01KHTKFYDWMYB8PHB3HV3T89YE	inr	{"value": "180", "precision": 20}	0	2026-02-19 14:55:28.64+05:30	2026-02-19 14:55:28.64+05:30	\N	\N	180	\N	\N	\N	\N
price_01KHTKFYDWG4YFF1H58ZAZBRZA	\N	pset_01KHTKFYDWMYB8PHB3HV3T89YE	usd	{"value": "2", "precision": 20}	0	2026-02-19 14:55:28.64+05:30	2026-02-19 14:55:28.64+05:30	\N	\N	2	\N	\N	\N	\N
price_01KHTKFYDXXDFSGDS8W023656S	\N	pset_01KHTKFYDXEYT1KXSTYBGS0E74	inr	{"value": "150", "precision": 20}	0	2026-02-19 14:55:28.64+05:30	2026-02-19 14:55:28.64+05:30	\N	\N	150	\N	\N	\N	\N
price_01KHTKFYDXNWXVQ68KQD57BNJ2	\N	pset_01KHTKFYDXEYT1KXSTYBGS0E74	usd	{"value": "2", "precision": 20}	0	2026-02-19 14:55:28.64+05:30	2026-02-19 14:55:28.64+05:30	\N	\N	2	\N	\N	\N	\N
price_01KHTKFYDXAJDYN5WJSSDZM01C	\N	pset_01KHTKFYDX25JVCREVVKYR18MC	inr	{"value": "170", "precision": 20}	0	2026-02-19 14:55:28.64+05:30	2026-02-19 14:55:28.64+05:30	\N	\N	170	\N	\N	\N	\N
price_01KHTKFYDX86WKQC6F76VQR63F	\N	pset_01KHTKFYDX25JVCREVVKYR18MC	usd	{"value": "2", "precision": 20}	0	2026-02-19 14:55:28.64+05:30	2026-02-19 14:55:28.64+05:30	\N	\N	2	\N	\N	\N	\N
price_01KHTKFYDYCFC2XQGTVRFVES3N	\N	pset_01KHTKFYDYR51BV8Y3EHHBBAEE	inr	{"value": "220", "precision": 20}	0	2026-02-19 14:55:28.64+05:30	2026-02-19 14:55:28.64+05:30	\N	\N	220	\N	\N	\N	\N
price_01KHTKFYDY9DARJF6YFPGW704C	\N	pset_01KHTKFYDYR51BV8Y3EHHBBAEE	usd	{"value": "3", "precision": 20}	0	2026-02-19 14:55:28.64+05:30	2026-02-19 14:55:28.64+05:30	\N	\N	3	\N	\N	\N	\N
price_01KHTKFYDYR1DZFZGMHH7XK79V	\N	pset_01KHTKFYDYA6JGRS4VS72PF8W7	inr	{"value": "190", "precision": 20}	0	2026-02-19 14:55:28.64+05:30	2026-02-19 14:55:28.64+05:30	\N	\N	190	\N	\N	\N	\N
price_01KHTKFYDYBH1J1H1C7S83BTN4	\N	pset_01KHTKFYDYA6JGRS4VS72PF8W7	usd	{"value": "2", "precision": 20}	0	2026-02-19 14:55:28.64+05:30	2026-02-19 14:55:28.64+05:30	\N	\N	2	\N	\N	\N	\N
price_01KHTKFYDZJ79KR3WH86HSFW0M	\N	pset_01KHTKFYDZX7B7RGBZEPS3MRTW	inr	{"value": "750", "precision": 20}	0	2026-02-19 14:55:28.64+05:30	2026-02-19 14:55:28.64+05:30	\N	\N	750	\N	\N	\N	\N
price_01KHTKFYDZV8PBSBZFW6B4HTFR	\N	pset_01KHTKFYDZX7B7RGBZEPS3MRTW	usd	{"value": "9", "precision": 20}	0	2026-02-19 14:55:28.64+05:30	2026-02-19 14:55:28.64+05:30	\N	\N	9	\N	\N	\N	\N
price_01KHTKFYDZMWZ8CQKE84PXS6TT	\N	pset_01KHTKFYDZXGRYRK05SCG5Z1M2	inr	{"value": "1800", "precision": 20}	0	2026-02-19 14:55:28.64+05:30	2026-02-19 14:55:28.64+05:30	\N	\N	1800	\N	\N	\N	\N
price_01KHTKFYDZ8WKZAC8ZA7QQTMXP	\N	pset_01KHTKFYDZXGRYRK05SCG5Z1M2	usd	{"value": "21", "precision": 20}	0	2026-02-19 14:55:28.64+05:30	2026-02-19 14:55:28.64+05:30	\N	\N	21	\N	\N	\N	\N
price_01KHTKFY63MYQMSCB217N1YV5C	\N	pset_01KHTKFY64GE8CCS4R3RZTGKJ4	inr	{"value": "0", "precision": 20}	0	2026-02-19 14:55:28.389+05:30	2026-02-19 16:32:00.689+05:30	\N	\N	0	\N	\N	\N	\N
price_01KHTKFY64T4MP6G1V84HH75WA	\N	pset_01KHTKFY64GE8CCS4R3RZTGKJ4	inr	{"value": "0", "precision": 20}	1	2026-02-19 14:55:28.389+05:30	2026-02-19 16:32:00.702+05:30	\N	\N	0	\N	\N	\N	\N
price_01KHWRQ349WV4JN5FYSE3WSXWN	\N	pset_01KHWRQ34AYNKP4MVC23P71MZQ	inr	{"value": "180", "precision": 20}	0	2026-02-20 11:05:14.571+05:30	2026-02-20 11:05:14.571+05:30	\N	\N	180	\N	\N	\N	\N
price_01KHWRQ34AWM2VZV030RH92MG1	\N	pset_01KHWRQ34AYNKP4MVC23P71MZQ	inr	{"value": "180", "precision": 20}	1	2026-02-20 11:05:14.572+05:30	2026-02-20 11:05:14.572+05:30	\N	\N	180	\N	\N	\N	\N
price_01KHWRQ34ATCK0CDW577HEWT5F	\N	pset_01KHWRQ34B7QZEVZ1HKW4TB14Q	inr	{"value": "350", "precision": 20}	0	2026-02-20 11:05:14.572+05:30	2026-02-20 11:05:14.572+05:30	\N	\N	350	\N	\N	\N	\N
price_01KHWRQ34B8RKQH4XGZBQ2X9XP	\N	pset_01KHWRQ34B7QZEVZ1HKW4TB14Q	inr	{"value": "350", "precision": 20}	1	2026-02-20 11:05:14.572+05:30	2026-02-20 11:05:14.572+05:30	\N	\N	350	\N	\N	\N	\N
price_01KHTKFYDXJHZSRKQN6S8TD3BQ	\N	pset_01KHTKFYDYCDRHYVPJB8QC5R4Q	inr	{"value": "130", "precision": 20}	0	2026-02-19 14:55:28.64+05:30	2026-02-20 11:18:50.108+05:30	2026-02-20 11:18:50.097+05:30	\N	130	\N	\N	\N	\N
price_01KHTKFYDYTBWDJ7FA7SKX3M5Z	\N	pset_01KHTKFYDYCDRHYVPJB8QC5R4Q	usd	{"value": "2", "precision": 20}	0	2026-02-19 14:55:28.64+05:30	2026-02-20 11:18:50.109+05:30	2026-02-20 11:18:50.097+05:30	\N	2	\N	\N	\N	\N
\.


--
-- Data for Name: price_list; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.price_list (id, status, starts_at, ends_at, rules_count, title, description, type, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: price_list_rule; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.price_list_rule (id, price_list_id, created_at, updated_at, deleted_at, value, attribute) FROM stdin;
\.


--
-- Data for Name: price_preference; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.price_preference (id, attribute, value, is_tax_inclusive, created_at, updated_at, deleted_at) FROM stdin;
prpref_01KHTF8JSVAEMP04T66Q54B2S2	currency_code	eur	f	2026-02-19 13:41:33.051+05:30	2026-02-19 13:41:33.051+05:30	\N
prpref_01KHTKFY1ZZ7CN9DBNKD3ZG8DK	region_id	reg_01KHTKFY0KFEBQMJJMD734XVS0	f	2026-02-19 14:55:28.255+05:30	2026-02-19 14:55:28.255+05:30	\N
\.


--
-- Data for Name: price_rule; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.price_rule (id, value, priority, price_id, created_at, updated_at, deleted_at, attribute, operator) FROM stdin;
prule_01KHTKFY644GNFAN5SFQYJPEDP	reg_01KHTKFY0KFEBQMJJMD734XVS0	0	price_01KHTKFY64T4MP6G1V84HH75WA	2026-02-19 14:55:28.389+05:30	2026-02-19 14:55:28.389+05:30	\N	region_id	eq
prule_01KHWRQ34A9GXE4X35TGVQY69T	reg_01KHTKFY0KFEBQMJJMD734XVS0	0	price_01KHWRQ34AWM2VZV030RH92MG1	2026-02-20 11:05:14.572+05:30	2026-02-20 11:05:14.572+05:30	\N	region_id	eq
prule_01KHWRQ34AM721NKCK2000CPR5	reg_01KHTKFY0KFEBQMJJMD734XVS0	0	price_01KHWRQ34B8RKQH4XGZBQ2X9XP	2026-02-20 11:05:14.572+05:30	2026-02-20 11:05:14.572+05:30	\N	region_id	eq
\.


--
-- Data for Name: price_set; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.price_set (id, created_at, updated_at, deleted_at) FROM stdin;
pset_01KHTKFY64GE8CCS4R3RZTGKJ4	2026-02-19 14:55:28.389+05:30	2026-02-19 14:55:28.389+05:30	\N
pset_01KHTKFYDWMYB8PHB3HV3T89YE	2026-02-19 14:55:28.639+05:30	2026-02-19 14:55:28.639+05:30	\N
pset_01KHTKFYDXEYT1KXSTYBGS0E74	2026-02-19 14:55:28.639+05:30	2026-02-19 14:55:28.639+05:30	\N
pset_01KHTKFYDX25JVCREVVKYR18MC	2026-02-19 14:55:28.639+05:30	2026-02-19 14:55:28.639+05:30	\N
pset_01KHTKFYDYR51BV8Y3EHHBBAEE	2026-02-19 14:55:28.639+05:30	2026-02-19 14:55:28.639+05:30	\N
pset_01KHTKFYDYA6JGRS4VS72PF8W7	2026-02-19 14:55:28.639+05:30	2026-02-19 14:55:28.639+05:30	\N
pset_01KHTKFYDZX7B7RGBZEPS3MRTW	2026-02-19 14:55:28.639+05:30	2026-02-19 14:55:28.639+05:30	\N
pset_01KHTKFYDZXGRYRK05SCG5Z1M2	2026-02-19 14:55:28.639+05:30	2026-02-19 14:55:28.639+05:30	\N
pset_01KHWRQ34AYNKP4MVC23P71MZQ	2026-02-20 11:05:14.571+05:30	2026-02-20 11:05:14.571+05:30	\N
pset_01KHWRQ34B7QZEVZ1HKW4TB14Q	2026-02-20 11:05:14.571+05:30	2026-02-20 11:05:14.571+05:30	\N
pset_01KHTKFYDYCDRHYVPJB8QC5R4Q	2026-02-19 14:55:28.639+05:30	2026-02-20 11:18:50.097+05:30	2026-02-20 11:18:50.097+05:30
\.


--
-- Data for Name: product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product (id, title, handle, subtitle, description, is_giftcard, status, thumbnail, weight, length, height, width, origin_country, hs_code, mid_code, material, collection_id, type_id, discountable, external_id, created_at, updated_at, deleted_at, metadata) FROM stdin;
prod_01KHTKFY8WJRREXEG56P1SS1H0	Sattu	sattu	\N	Sattu 500g Pack	f	published	http://localhost:9000/static/1771563520886-image-1771563420177.png	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	2026-02-19 14:55:28.485+05:30	2026-02-20 10:28:41.032+05:30	\N	\N
prod_01KHTKFY8VZPJS9GHQAWR5FNNW	Jowar Atta	jowar-atta	\N	Fresh Jowar Atta	f	published	http://localhost:9000/static/1771495366853-image-1771495262796.png	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	2026-02-19 14:55:28.485+05:30	2026-02-20 10:55:57.626+05:30	\N	\N
prod_01KHTKFY8VDC4G7YD60DP3RVC1	Multigrain Atta	multigrain-atta	\N	Healthy Multigrain Atta	f	published	http://localhost:9000/static/1771496164803-image-1771495992704.png	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	2026-02-19 14:55:28.485+05:30	2026-02-20 10:56:27.787+05:30	\N	{"cow_breed": "Gir", "grass_fed": false, "packaging_type": "Glass Jar", "organic_certified": false, "processing_method": "Bilona"}
prod_01KHTKFY8VS3ECJSEKB0B0BXCH	Whole Wheat Atta	whole-wheat-atta	\N	Pure Whole Wheat Atta	f	published	http://localhost:9000/static/1771563167600-image-1771562970534.png	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	2026-02-19 14:55:28.485+05:30	2026-02-20 10:56:45.11+05:30	\N	\N
prod_01KHWRQ31J9VGVRDJ4STXTZW2D	Moong Multigrain Atta	moong-multigrain-atta		Healthy Moong Multigrain Atta	f	published	http://localhost:9000/static/1771565714464-image-1771565128461.png	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	2026-02-20 11:05:14.485+05:30	2026-02-20 11:09:43.625+05:30	\N	\N
prod_01KHTKFY8WWARWZEMAVTJ7EHT1	Gousarram Capsule	gousarram-capsule	\N	Gousarram Capsule 30 pcs pack bottle	f	published	http://localhost:9000/static/1771566277896-image-1771566216155.png	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	2026-02-19 14:55:28.485+05:30	2026-02-20 11:14:37.949+05:30	\N	\N
prod_01KHTKFY8WT4SCZ4AMAKQ4F16M	Moringa Sattu	moringa-sattu	\N	Moringa Sattu 500g Pack	f	published	http://localhost:9000/static/1771566477341-image-1771563420177.png	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	2026-02-19 14:55:28.485+05:30	2026-02-20 11:17:57.424+05:30	\N	\N
prod_01KHTKFY8VSZPCJHT6NHEJ88ET	Bajra Atta	bajra-atta	\N	Healthy Bajra Atta	f	published	https://placehold.co/600x400?text=Bajra%20Atta	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	2026-02-19 14:55:28.485+05:30	2026-02-20 11:18:50.085+05:30	2026-02-20 11:18:50.085+05:30	\N
prod_01KHTKFY8WJSF8SQ05MV2PS7J8	Ghee	ghee-500	\N	Pure Ghee 500g Bottle	f	published	http://localhost:9000/static/1771569404776-image-1771569324022.png	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	2026-02-19 14:55:28.486+05:30	2026-02-20 12:17:31.193+05:30	\N	\N
\.


--
-- Data for Name: product_category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_category (id, name, description, handle, mpath, is_active, is_internal, rank, parent_category_id, created_at, updated_at, deleted_at, metadata) FROM stdin;
pcat_01KHTKFY8CNSZXYWPPZGQVTN4J	Atta		atta	pcat_01KHTKFY8CNSZXYWPPZGQVTN4J	t	f	0	\N	2026-02-19 14:55:28.461+05:30	2026-02-19 14:55:28.461+05:30	\N	\N
pcat_01KHTKFY8D2Y2B2BJY5WBJSJ6Q	Ghee		ghee-cat	pcat_01KHTKFY8D2Y2B2BJY5WBJSJ6Q	t	f	1	\N	2026-02-19 14:55:28.462+05:30	2026-02-19 14:55:28.462+05:30	\N	\N
pcat_01KHTKFY8DP0M66HSCN60EE23S	Health		health	pcat_01KHTKFY8DP0M66HSCN60EE23S	t	f	2	\N	2026-02-19 14:55:28.462+05:30	2026-02-19 14:55:28.462+05:30	\N	\N
\.


--
-- Data for Name: product_category_product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_category_product (product_id, product_category_id) FROM stdin;
prod_01KHTKFY8VDC4G7YD60DP3RVC1	pcat_01KHTKFY8CNSZXYWPPZGQVTN4J
prod_01KHTKFY8VS3ECJSEKB0B0BXCH	pcat_01KHTKFY8CNSZXYWPPZGQVTN4J
prod_01KHTKFY8VZPJS9GHQAWR5FNNW	pcat_01KHTKFY8CNSZXYWPPZGQVTN4J
prod_01KHTKFY8VSZPCJHT6NHEJ88ET	pcat_01KHTKFY8CNSZXYWPPZGQVTN4J
prod_01KHTKFY8WT4SCZ4AMAKQ4F16M	pcat_01KHTKFY8CNSZXYWPPZGQVTN4J
prod_01KHTKFY8WT4SCZ4AMAKQ4F16M	pcat_01KHTKFY8DP0M66HSCN60EE23S
prod_01KHTKFY8WJRREXEG56P1SS1H0	pcat_01KHTKFY8CNSZXYWPPZGQVTN4J
prod_01KHTKFY8WWARWZEMAVTJ7EHT1	pcat_01KHTKFY8DP0M66HSCN60EE23S
prod_01KHTKFY8WJSF8SQ05MV2PS7J8	pcat_01KHTKFY8D2Y2B2BJY5WBJSJ6Q
prod_01KHWRQ31J9VGVRDJ4STXTZW2D	pcat_01KHTKFY8CNSZXYWPPZGQVTN4J
prod_01KHTKFY8WJRREXEG56P1SS1H0	pcat_01KHTKFY8DP0M66HSCN60EE23S
\.


--
-- Data for Name: product_collection; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_collection (id, title, handle, metadata, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: product_option; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_option (id, title, product_id, metadata, created_at, updated_at, deleted_at) FROM stdin;
opt_01KHTKFY8Y6ZZSHPRHV64D2H2H	Option	prod_01KHTKFY8VDC4G7YD60DP3RVC1	\N	2026-02-19 14:55:28.486+05:30	2026-02-19 14:55:28.486+05:30	\N
opt_01KHTKFY9131XAVFV5HMPEFTMC	Option	prod_01KHTKFY8VS3ECJSEKB0B0BXCH	\N	2026-02-19 14:55:28.486+05:30	2026-02-19 14:55:28.486+05:30	\N
opt_01KHTKFY92T76K9213W4TKSAVF	Option	prod_01KHTKFY8VZPJS9GHQAWR5FNNW	\N	2026-02-19 14:55:28.486+05:30	2026-02-19 14:55:28.486+05:30	\N
opt_01KHTKFY93TQ49YZYZDE8AJJXR	Option	prod_01KHTKFY8WT4SCZ4AMAKQ4F16M	\N	2026-02-19 14:55:28.486+05:30	2026-02-19 14:55:28.486+05:30	\N
opt_01KHTKFY93X1H647E34QCFH42A	Option	prod_01KHTKFY8WJRREXEG56P1SS1H0	\N	2026-02-19 14:55:28.486+05:30	2026-02-19 14:55:28.486+05:30	\N
opt_01KHTKFY94A384VB054B196VWE	Option	prod_01KHTKFY8WWARWZEMAVTJ7EHT1	\N	2026-02-19 14:55:28.486+05:30	2026-02-19 14:55:28.486+05:30	\N
opt_01KHTKFY94D2Z55DATJAM0SNM1	Option	prod_01KHTKFY8WJSF8SQ05MV2PS7J8	\N	2026-02-19 14:55:28.486+05:30	2026-02-19 14:55:28.486+05:30	\N
opt_01KHWRQ31KXVV200GQF56B21WJ	weight	prod_01KHWRQ31J9VGVRDJ4STXTZW2D	\N	2026-02-20 11:05:14.485+05:30	2026-02-20 11:05:14.485+05:30	\N
opt_01KHTKFY92CB6DY0TEP8XN70AW	Option	prod_01KHTKFY8VSZPCJHT6NHEJ88ET	\N	2026-02-19 14:55:28.486+05:30	2026-02-20 11:18:50.102+05:30	2026-02-20 11:18:50.085+05:30
\.


--
-- Data for Name: product_option_value; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_option_value (id, value, option_id, metadata, created_at, updated_at, deleted_at) FROM stdin;
optval_01KHTKFY8YGYPASFGZ0MG57F19	1 Pack	opt_01KHTKFY8Y6ZZSHPRHV64D2H2H	\N	2026-02-19 14:55:28.486+05:30	2026-02-19 14:55:28.486+05:30	\N
optval_01KHTKFY91031Z5GNYB288RNY3	1 Pack	opt_01KHTKFY9131XAVFV5HMPEFTMC	\N	2026-02-19 14:55:28.486+05:30	2026-02-19 14:55:28.486+05:30	\N
optval_01KHTKFY91BFQXR6FPJD2KTHMV	1 Pack	opt_01KHTKFY92T76K9213W4TKSAVF	\N	2026-02-19 14:55:28.486+05:30	2026-02-19 14:55:28.486+05:30	\N
optval_01KHTKFY92806ECZ4HGE4E9596	500g	opt_01KHTKFY93TQ49YZYZDE8AJJXR	\N	2026-02-19 14:55:28.486+05:30	2026-02-19 14:55:28.486+05:30	\N
optval_01KHTKFY93F4K0JBBAVS7XE0WY	500g	opt_01KHTKFY93X1H647E34QCFH42A	\N	2026-02-19 14:55:28.486+05:30	2026-02-19 14:55:28.486+05:30	\N
optval_01KHTKFY93Q77NZMXFEZN1ET7Y	30 pcs Bottle	opt_01KHTKFY94A384VB054B196VWE	\N	2026-02-19 14:55:28.486+05:30	2026-02-19 14:55:28.486+05:30	\N
optval_01KHTKFY94PG1FYXQ4SF2872WX	500g Bottle	opt_01KHTKFY94D2Z55DATJAM0SNM1	\N	2026-02-19 14:55:28.486+05:30	2026-02-19 14:55:28.486+05:30	\N
optval_01KHWRQ31J1NH5EP1BD84RHVD1	500g	opt_01KHWRQ31KXVV200GQF56B21WJ	\N	2026-02-20 11:05:14.486+05:30	2026-02-20 11:05:14.486+05:30	\N
optval_01KHWRQ31J3PD8XT6TP9MNCR9W	1kg	opt_01KHWRQ31KXVV200GQF56B21WJ	\N	2026-02-20 11:05:14.486+05:30	2026-02-20 11:05:14.486+05:30	\N
optval_01KHTKFY92ZS0DVT5KSYXV1Q51	1 Pack	opt_01KHTKFY92CB6DY0TEP8XN70AW	\N	2026-02-19 14:55:28.486+05:30	2026-02-20 11:18:50.13+05:30	2026-02-20 11:18:50.085+05:30
\.


--
-- Data for Name: product_sales_channel; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_sales_channel (product_id, sales_channel_id, id, created_at, updated_at, deleted_at) FROM stdin;
prod_01KHTKFY8VDC4G7YD60DP3RVC1	sc_01KHTF8JGN9HZWVEK942B6AAGQ	prodsc_01KHTKFYA88ZSATVZXEYV17PCT	2026-02-19 14:55:28.519925+05:30	2026-02-19 14:55:28.519925+05:30	\N
prod_01KHTKFY8VS3ECJSEKB0B0BXCH	sc_01KHTF8JGN9HZWVEK942B6AAGQ	prodsc_01KHTKFYA911504FHV9MPGAMW0	2026-02-19 14:55:28.519925+05:30	2026-02-19 14:55:28.519925+05:30	\N
prod_01KHTKFY8VZPJS9GHQAWR5FNNW	sc_01KHTF8JGN9HZWVEK942B6AAGQ	prodsc_01KHTKFYA93XAG8009QHN6WZDJ	2026-02-19 14:55:28.519925+05:30	2026-02-19 14:55:28.519925+05:30	\N
prod_01KHTKFY8WT4SCZ4AMAKQ4F16M	sc_01KHTF8JGN9HZWVEK942B6AAGQ	prodsc_01KHTKFYA9CK7MGSVN347KVRZP	2026-02-19 14:55:28.519925+05:30	2026-02-19 14:55:28.519925+05:30	\N
prod_01KHTKFY8WJRREXEG56P1SS1H0	sc_01KHTF8JGN9HZWVEK942B6AAGQ	prodsc_01KHTKFYA984TYP14EJXY591KB	2026-02-19 14:55:28.519925+05:30	2026-02-19 14:55:28.519925+05:30	\N
prod_01KHTKFY8WWARWZEMAVTJ7EHT1	sc_01KHTF8JGN9HZWVEK942B6AAGQ	prodsc_01KHTKFYAATRCZ01312S5WBPB1	2026-02-19 14:55:28.519925+05:30	2026-02-19 14:55:28.519925+05:30	\N
prod_01KHTKFY8WJSF8SQ05MV2PS7J8	sc_01KHTF8JGN9HZWVEK942B6AAGQ	prodsc_01KHTKFYAA7FGV046NBKHYXD4C	2026-02-19 14:55:28.519925+05:30	2026-02-19 14:55:28.519925+05:30	\N
prod_01KHWRQ31J9VGVRDJ4STXTZW2D	sc_01KHTF8JGN9HZWVEK942B6AAGQ	prodsc_01KHWRQ32G1DF8HXKDCYM3PX3Y	2026-02-20 11:05:14.511418+05:30	2026-02-20 11:05:14.511418+05:30	\N
prod_01KHTKFY8VSZPCJHT6NHEJ88ET	sc_01KHTF8JGN9HZWVEK942B6AAGQ	prodsc_01KHTKFYA9SF81MF0NM6FMQTE1	2026-02-19 14:55:28.519925+05:30	2026-02-20 11:18:50.09+05:30	2026-02-20 11:18:50.089+05:30
\.


--
-- Data for Name: product_shipping_profile; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_shipping_profile (product_id, shipping_profile_id, id, created_at, updated_at, deleted_at) FROM stdin;
prod_01KHTKFY8VDC4G7YD60DP3RVC1	sp_01KHTF7PHNV7K4NX7KYCPW6WY1	prodsp_01KHTKFYAS951WVEV99Y8HSTSR	2026-02-19 14:55:28.537429+05:30	2026-02-19 14:55:28.537429+05:30	\N
prod_01KHTKFY8VS3ECJSEKB0B0BXCH	sp_01KHTF7PHNV7K4NX7KYCPW6WY1	prodsp_01KHTKFYAT15T8K1MGSK1YQ04P	2026-02-19 14:55:28.537429+05:30	2026-02-19 14:55:28.537429+05:30	\N
prod_01KHTKFY8VZPJS9GHQAWR5FNNW	sp_01KHTF7PHNV7K4NX7KYCPW6WY1	prodsp_01KHTKFYAT9S7362RZVSGEX1H0	2026-02-19 14:55:28.537429+05:30	2026-02-19 14:55:28.537429+05:30	\N
prod_01KHTKFY8WT4SCZ4AMAKQ4F16M	sp_01KHTF7PHNV7K4NX7KYCPW6WY1	prodsp_01KHTKFYAT2GQZRXCXZ9T7H1YF	2026-02-19 14:55:28.537429+05:30	2026-02-19 14:55:28.537429+05:30	\N
prod_01KHTKFY8WJRREXEG56P1SS1H0	sp_01KHTF7PHNV7K4NX7KYCPW6WY1	prodsp_01KHTKFYATZTVNPGQ8TFFAMPXC	2026-02-19 14:55:28.537429+05:30	2026-02-19 14:55:28.537429+05:30	\N
prod_01KHTKFY8WWARWZEMAVTJ7EHT1	sp_01KHTF7PHNV7K4NX7KYCPW6WY1	prodsp_01KHTKFYAT48M46YYMPHWWR7MP	2026-02-19 14:55:28.537429+05:30	2026-02-19 14:55:28.537429+05:30	\N
prod_01KHTKFY8WJSF8SQ05MV2PS7J8	sp_01KHTF7PHNV7K4NX7KYCPW6WY1	prodsp_01KHTKFYATD2M1KECTGT21Y8N5	2026-02-19 14:55:28.537429+05:30	2026-02-19 14:55:28.537429+05:30	\N
prod_01KHTKFY8VSZPCJHT6NHEJ88ET	sp_01KHTF7PHNV7K4NX7KYCPW6WY1	prodsp_01KHTKFYAT4YQ1FYEQGJ1AAFRA	2026-02-19 14:55:28.537429+05:30	2026-02-20 11:18:50.087+05:30	2026-02-20 11:18:50.087+05:30
\.


--
-- Data for Name: product_tag; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_tag (id, value, metadata, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: product_tags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_tags (product_id, product_tag_id) FROM stdin;
\.


--
-- Data for Name: product_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_type (id, value, metadata, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: product_variant; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_variant (id, title, sku, barcode, ean, upc, allow_backorder, manage_inventory, hs_code, origin_country, mid_code, material, weight, length, height, width, metadata, variant_rank, product_id, created_at, updated_at, deleted_at, thumbnail) FROM stdin;
variant_01KHTKFYBZ5CC78V7V83N6PEYA	1 Pack	MULTI-ATTA-1	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KHTKFY8VDC4G7YD60DP3RVC1	2026-02-19 14:55:28.578+05:30	2026-02-19 14:55:28.578+05:30	\N	\N
variant_01KHTKFYC0TFX6FNR1E81DGQZP	1 Pack	WHEAT-ATTA-1	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KHTKFY8VS3ECJSEKB0B0BXCH	2026-02-19 14:55:28.578+05:30	2026-02-19 14:55:28.578+05:30	\N	\N
variant_01KHTKFYC0586X2W8DZNBMHGP1	1 Pack	JOWAR-ATTA-1	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KHTKFY8VZPJS9GHQAWR5FNNW	2026-02-19 14:55:28.578+05:30	2026-02-19 14:55:28.578+05:30	\N	\N
variant_01KHTKFYC017FK45D5EW04GD9Y	500g	MORINGA-SATTU-500	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KHTKFY8WT4SCZ4AMAKQ4F16M	2026-02-19 14:55:28.578+05:30	2026-02-19 14:55:28.578+05:30	\N	\N
variant_01KHTKFYC16S5EDBASJG0P1RSS	500g	SATTU-500	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KHTKFY8WJRREXEG56P1SS1H0	2026-02-19 14:55:28.578+05:30	2026-02-19 14:55:28.578+05:30	\N	\N
variant_01KHTKFYC1Z2VKQGRPW169J7QF	30 pcs Bottle	GOUSARRAM-CAP-30	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KHTKFY8WWARWZEMAVTJ7EHT1	2026-02-19 14:55:28.578+05:30	2026-02-19 14:55:28.578+05:30	\N	\N
variant_01KHTKFYC1T7GYJAPEK3GBX2HY	500g Bottle	GHEE-500	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KHTKFY8WJSF8SQ05MV2PS7J8	2026-02-19 14:55:28.578+05:30	2026-02-19 14:55:28.578+05:30	\N	\N
variant_01KHWRQ33GRK9DVKN84QVS62GF	500g	moong-500	\N	\N	\N	t	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KHWRQ31J9VGVRDJ4STXTZW2D	2026-02-20 11:05:14.544+05:30	2026-02-20 11:05:14.544+05:30	\N	\N
variant_01KHTKFYC0QXCCFS2QWY93M2VC	1 Pack	BAJRA-ATTA-1	\N	\N	\N	f	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	prod_01KHTKFY8VSZPCJHT6NHEJ88ET	2026-02-19 14:55:28.578+05:30	2026-02-20 11:18:50.102+05:30	2026-02-20 11:18:50.085+05:30	\N
variant_01KHWRQ33GYW0XRPZB12J2SNFR	1kg	moong-1	\N	\N	\N	t	t	\N	in	\N	\N	\N	\N	\N	\N	\N	1	prod_01KHWRQ31J9VGVRDJ4STXTZW2D	2026-02-20 11:05:14.545+05:30	2026-02-20 11:05:14.545+05:30	\N	\N
\.


--
-- Data for Name: product_variant_inventory_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_variant_inventory_item (variant_id, inventory_item_id, id, required_quantity, created_at, updated_at, deleted_at) FROM stdin;
variant_01KHTKFYBZ5CC78V7V83N6PEYA	iitem_01KHTKFYCSC5JZKQ4Y9KV4CNMM	pvitem_01KHTKFYDFRE6QD65WFFSF6533	1	2026-02-19 14:55:28.623442+05:30	2026-02-19 14:55:28.623442+05:30	\N
variant_01KHTKFYC0TFX6FNR1E81DGQZP	iitem_01KHTKFYCT6Q0GZB6ZAF12Z2MS	pvitem_01KHTKFYDGC8K9X41MWPSVRFSV	1	2026-02-19 14:55:28.623442+05:30	2026-02-19 14:55:28.623442+05:30	\N
variant_01KHTKFYC0586X2W8DZNBMHGP1	iitem_01KHTKFYCTWZZ7XY5JQ4MCV3F9	pvitem_01KHTKFYDG0R0DFF6J7J9QGS19	1	2026-02-19 14:55:28.623442+05:30	2026-02-19 14:55:28.623442+05:30	\N
variant_01KHTKFYC017FK45D5EW04GD9Y	iitem_01KHTKFYCT4PX9XJ656M0ZS506	pvitem_01KHTKFYDGP4V2VEX92Y9XHMWR	1	2026-02-19 14:55:28.623442+05:30	2026-02-19 14:55:28.623442+05:30	\N
variant_01KHTKFYC16S5EDBASJG0P1RSS	iitem_01KHTKFYCTGT9NTYSJMQHGVVV0	pvitem_01KHTKFYDHW1Z10PAFQ0MM5WV6	1	2026-02-19 14:55:28.623442+05:30	2026-02-19 14:55:28.623442+05:30	\N
variant_01KHTKFYC1Z2VKQGRPW169J7QF	iitem_01KHTKFYCT2DG9C8SS0TSCB42K	pvitem_01KHTKFYDH2Z2J1P34R88WQYT5	1	2026-02-19 14:55:28.623442+05:30	2026-02-19 14:55:28.623442+05:30	\N
variant_01KHTKFYC1T7GYJAPEK3GBX2HY	iitem_01KHTKFYCTCB81PDCQMX1QS4HN	pvitem_01KHTKFYDH6TS2TERCE7WEN1A3	1	2026-02-19 14:55:28.623442+05:30	2026-02-19 14:55:28.623442+05:30	\N
variant_01KHWRQ33GRK9DVKN84QVS62GF	iitem_01KHWRYE1SXCADCZQYBZV6FWSD	pvitem_01KHWS185DFYQS4SV0TDC1J06Y	1000	2026-02-20 11:10:47.405332+05:30	2026-02-20 11:10:47.405332+05:30	\N
variant_01KHTKFYC0QXCCFS2QWY93M2VC	iitem_01KHTKFYCTS2RSNBB41KXB9N84	pvitem_01KHTKFYDGMJMR8GFM4ZWN6QY9	1	2026-02-19 14:55:28.623442+05:30	2026-02-20 11:18:50.072+05:30	2026-02-20 11:18:50.072+05:30
\.


--
-- Data for Name: product_variant_option; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_variant_option (variant_id, option_value_id) FROM stdin;
variant_01KHTKFYBZ5CC78V7V83N6PEYA	optval_01KHTKFY8YGYPASFGZ0MG57F19
variant_01KHTKFYC0TFX6FNR1E81DGQZP	optval_01KHTKFY91031Z5GNYB288RNY3
variant_01KHTKFYC0586X2W8DZNBMHGP1	optval_01KHTKFY91BFQXR6FPJD2KTHMV
variant_01KHTKFYC0QXCCFS2QWY93M2VC	optval_01KHTKFY92ZS0DVT5KSYXV1Q51
variant_01KHTKFYC017FK45D5EW04GD9Y	optval_01KHTKFY92806ECZ4HGE4E9596
variant_01KHTKFYC16S5EDBASJG0P1RSS	optval_01KHTKFY93F4K0JBBAVS7XE0WY
variant_01KHTKFYC1Z2VKQGRPW169J7QF	optval_01KHTKFY93Q77NZMXFEZN1ET7Y
variant_01KHTKFYC1T7GYJAPEK3GBX2HY	optval_01KHTKFY94PG1FYXQ4SF2872WX
variant_01KHWRQ33GRK9DVKN84QVS62GF	optval_01KHWRQ31J1NH5EP1BD84RHVD1
variant_01KHWRQ33GYW0XRPZB12J2SNFR	optval_01KHWRQ31J3PD8XT6TP9MNCR9W
\.


--
-- Data for Name: product_variant_price_set; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_variant_price_set (variant_id, price_set_id, id, created_at, updated_at, deleted_at) FROM stdin;
variant_01KHTKFYBZ5CC78V7V83N6PEYA	pset_01KHTKFYDWMYB8PHB3HV3T89YE	pvps_01KHTKFYEVQW211N4E12RF9N72	2026-02-19 14:55:28.666858+05:30	2026-02-19 14:55:28.666858+05:30	\N
variant_01KHTKFYC0TFX6FNR1E81DGQZP	pset_01KHTKFYDXEYT1KXSTYBGS0E74	pvps_01KHTKFYEWCKPH14WDYZ2C0CKX	2026-02-19 14:55:28.666858+05:30	2026-02-19 14:55:28.666858+05:30	\N
variant_01KHTKFYC0586X2W8DZNBMHGP1	pset_01KHTKFYDX25JVCREVVKYR18MC	pvps_01KHTKFYEW1R0MD4F2NQN27TMD	2026-02-19 14:55:28.666858+05:30	2026-02-19 14:55:28.666858+05:30	\N
variant_01KHTKFYC017FK45D5EW04GD9Y	pset_01KHTKFYDYR51BV8Y3EHHBBAEE	pvps_01KHTKFYEW4GXG077H6XB9HD6Z	2026-02-19 14:55:28.666858+05:30	2026-02-19 14:55:28.666858+05:30	\N
variant_01KHTKFYC16S5EDBASJG0P1RSS	pset_01KHTKFYDYA6JGRS4VS72PF8W7	pvps_01KHTKFYEXHT3R52XVB8529M16	2026-02-19 14:55:28.666858+05:30	2026-02-19 14:55:28.666858+05:30	\N
variant_01KHTKFYC1Z2VKQGRPW169J7QF	pset_01KHTKFYDZX7B7RGBZEPS3MRTW	pvps_01KHTKFYEXH2FY353JFY5B8E0B	2026-02-19 14:55:28.666858+05:30	2026-02-19 14:55:28.666858+05:30	\N
variant_01KHTKFYC1T7GYJAPEK3GBX2HY	pset_01KHTKFYDZXGRYRK05SCG5Z1M2	pvps_01KHTKFYEXGYGH7BZKQD0DHAMX	2026-02-19 14:55:28.666858+05:30	2026-02-19 14:55:28.666858+05:30	\N
variant_01KHWRQ33GRK9DVKN84QVS62GF	pset_01KHWRQ34AYNKP4MVC23P71MZQ	pvps_01KHWRQ358J8VZW6J0H1CWRF4G	2026-02-20 11:05:14.600235+05:30	2026-02-20 11:05:14.600235+05:30	\N
variant_01KHWRQ33GYW0XRPZB12J2SNFR	pset_01KHWRQ34B7QZEVZ1HKW4TB14Q	pvps_01KHWRQ358F88FS2QBNFQJJKJD	2026-02-20 11:05:14.600235+05:30	2026-02-20 11:05:14.600235+05:30	\N
variant_01KHTKFYC0QXCCFS2QWY93M2VC	pset_01KHTKFYDYCDRHYVPJB8QC5R4Q	pvps_01KHTKFYEWATGZYXHGQ5X7FKZ3	2026-02-19 14:55:28.666858+05:30	2026-02-20 11:18:50.089+05:30	2026-02-20 11:18:50.088+05:30
\.


--
-- Data for Name: product_variant_product_image; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_variant_product_image (id, variant_id, image_id, created_at, updated_at, deleted_at) FROM stdin;
pvpi_01KHTNNQNJ3EECN64XME038WTR	variant_01KHTKFYC0586X2W8DZNBMHGP1	74ycd	2026-02-19 15:33:35.475+05:30	2026-02-19 15:33:35.475+05:30	\N
pvpi_01KHTPQMEX57ZNGSRM03KRCG83	variant_01KHTKFYBZ5CC78V7V83N6PEYA	m7o2b8	2026-02-19 15:52:06.301+05:30	2026-02-19 15:52:06.301+05:30	\N
pvpi_01KHWP9ZPJ0XXPSV36YXJXZ6G7	variant_01KHTKFYC0TFX6FNR1E81DGQZP	d2cqr	2026-02-20 10:23:07.923+05:30	2026-02-20 10:23:07.923+05:30	\N
pvpi_01KHWWVPX1TN8PFAECDF8HY62V	variant_01KHTKFYC1T7GYJAPEK3GBX2HY	zj923	2026-02-20 12:17:40.193+05:30	2026-02-20 12:17:40.193+05:30	\N
\.


--
-- Data for Name: promotion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.promotion (id, code, campaign_id, is_automatic, type, created_at, updated_at, deleted_at, status, is_tax_inclusive, "limit", used, metadata) FROM stdin;
\.


--
-- Data for Name: promotion_application_method; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.promotion_application_method (id, value, raw_value, max_quantity, apply_to_quantity, buy_rules_min_quantity, type, target_type, allocation, promotion_id, created_at, updated_at, deleted_at, currency_code) FROM stdin;
\.


--
-- Data for Name: promotion_campaign; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.promotion_campaign (id, name, description, campaign_identifier, starts_at, ends_at, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: promotion_campaign_budget; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.promotion_campaign_budget (id, type, campaign_id, "limit", raw_limit, used, raw_used, created_at, updated_at, deleted_at, currency_code, attribute) FROM stdin;
\.


--
-- Data for Name: promotion_campaign_budget_usage; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.promotion_campaign_budget_usage (id, attribute_value, used, budget_id, raw_used, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: promotion_promotion_rule; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.promotion_promotion_rule (promotion_id, promotion_rule_id) FROM stdin;
\.


--
-- Data for Name: promotion_rule; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.promotion_rule (id, description, attribute, operator, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: promotion_rule_value; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.promotion_rule_value (id, promotion_rule_id, value, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: provider_identity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.provider_identity (id, entity_id, provider, auth_identity_id, user_metadata, provider_metadata, created_at, updated_at, deleted_at) FROM stdin;
01KHTHDMPJ0FN5D068GKENSCEP	admin@admin.com	emailpass	authid_01KHTHDMPKMB2DZF6875V71VEF	\N	{"password": "c2NyeXB0AA8AAAAIAAAAAZZ/gx+uKW+MHcE9rBoJr/NTGgdoV2ji3BTJje0XHaGuIwFelgQjsPG2dWnUFirmhRoE1aiZMYtT3FTbXWXSKbKn6YtXgynSk3u4RrX2ltJ6"}	2026-02-19 14:19:15.987+05:30	2026-02-19 14:19:15.987+05:30	\N
01KHTPY3ZM9ANNWS9KYFZGHP94	105051481222944598744	google	authid_01KHTPY3ZM3P5RJDQVXJENQBQ2	{"name": "chetan tikkal", "email": "chetan.novarsis@gmail.com", "picture": "https://lh3.googleusercontent.com/a/ACg8ocJPseQ73Bqdkr1ufelC70sdUulXvq7df6sBJhhRhVP_yIhcOQ=s96-c", "given_name": "chetan", "family_name": "tikkal"}	\N	2026-02-19 15:55:38.805+05:30	2026-02-19 15:55:38.805+05:30	\N
01KJ4KE2T2VR5DRRJX4XTS4PSV	admin@gheelocal.com	emailpass	authid_01KJ4KE2T2KG4CR29KY2EWTPAN	\N	{"password": "c2NyeXB0AA8AAAAIAAAAAWPI4Pt5d7/PJZGUeaN5pM6FejdMjzWx2FFxXCc9KCyYoPXmTCfBVUWkyZ9UnePNm5/smjbwH7+/P56WGyz1TtM08qVC0YbR/rV3kpN/Hxin"}	2026-02-23 12:06:51.907+05:30	2026-02-23 12:06:51.907+05:30	\N
01KJ4KVW6ZE4DR64D25T5PC3QP	admin@local.com	emailpass	authid_01KJ4KVW70WSN99WSHGHZXQR2F	\N	{"password": "c2NyeXB0AA8AAAAIAAAAASN62Zbhe+46k+YUUJnng2rG20AQwM2OB29Du6QuQx5cqhx8lLLZk2xLQ7BGdEHqpQtyRd7rchSMntvUwLstaWUiKorKOFuBsF42W/lzyCE5"}	2026-02-23 12:14:23.905+05:30	2026-02-23 12:14:23.905+05:30	\N
\.


--
-- Data for Name: publishable_api_key_sales_channel; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.publishable_api_key_sales_channel (publishable_key_id, sales_channel_id, id, created_at, updated_at, deleted_at) FROM stdin;
apk_01KHTF8JTBZHSMTH01M9S07V4F	sc_01KHTF8JGN9HZWVEK942B6AAGQ	pksc_01KHTKFY7SDKYANM47Q5S7MQYW	2026-02-19 13:41:33.098818+05:30	2026-02-19 13:41:33.098818+05:30	\N
\.


--
-- Data for Name: refund; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.refund (id, amount, raw_amount, payment_id, created_at, updated_at, deleted_at, created_by, metadata, refund_reason_id, note) FROM stdin;
\.


--
-- Data for Name: refund_reason; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.refund_reason (id, label, description, metadata, created_at, updated_at, deleted_at, code) FROM stdin;
refr_01KHTF7BHK8N7NH5F8EJ19D7GD	Shipping Issue	Refund due to lost, delayed, or misdelivered shipment	\N	2026-02-19 13:40:52.679966+05:30	2026-02-19 13:40:52.679966+05:30	\N	shipping_issue
refr_01KHTF7BHKG3NVA5YY32Y7B42N	Customer Care Adjustment	Refund given as goodwill or compensation for inconvenience	\N	2026-02-19 13:40:52.679966+05:30	2026-02-19 13:40:52.679966+05:30	\N	customer_care_adjustment
refr_01KHTF7BHK5QMR39HTSM5YSSM0	Pricing Error	Refund to correct an overcharge, missing discount, or incorrect price	\N	2026-02-19 13:40:52.679966+05:30	2026-02-19 13:40:52.679966+05:30	\N	pricing_error
\.


--
-- Data for Name: region; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.region (id, name, currency_code, metadata, created_at, updated_at, deleted_at, automatic_taxes) FROM stdin;
reg_01KHTKFY0KFEBQMJJMD734XVS0	India	inr	\N	2026-02-19 14:55:28.221+05:30	2026-02-19 14:55:28.221+05:30	\N	t
\.


--
-- Data for Name: region_country; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.region_country (iso_2, iso_3, num_code, name, display_name, region_id, metadata, created_at, updated_at, deleted_at) FROM stdin;
af	afg	004	AFGHANISTAN	Afghanistan	\N	\N	2026-02-19 13:41:02.407+05:30	2026-02-19 13:41:02.407+05:30	\N
al	alb	008	ALBANIA	Albania	\N	\N	2026-02-19 13:41:02.408+05:30	2026-02-19 13:41:02.408+05:30	\N
dz	dza	012	ALGERIA	Algeria	\N	\N	2026-02-19 13:41:02.408+05:30	2026-02-19 13:41:02.408+05:30	\N
as	asm	016	AMERICAN SAMOA	American Samoa	\N	\N	2026-02-19 13:41:02.408+05:30	2026-02-19 13:41:02.408+05:30	\N
ad	and	020	ANDORRA	Andorra	\N	\N	2026-02-19 13:41:02.408+05:30	2026-02-19 13:41:02.408+05:30	\N
ao	ago	024	ANGOLA	Angola	\N	\N	2026-02-19 13:41:02.408+05:30	2026-02-19 13:41:02.408+05:30	\N
ai	aia	660	ANGUILLA	Anguilla	\N	\N	2026-02-19 13:41:02.409+05:30	2026-02-19 13:41:02.409+05:30	\N
aq	ata	010	ANTARCTICA	Antarctica	\N	\N	2026-02-19 13:41:02.409+05:30	2026-02-19 13:41:02.409+05:30	\N
ag	atg	028	ANTIGUA AND BARBUDA	Antigua and Barbuda	\N	\N	2026-02-19 13:41:02.409+05:30	2026-02-19 13:41:02.409+05:30	\N
ar	arg	032	ARGENTINA	Argentina	\N	\N	2026-02-19 13:41:02.409+05:30	2026-02-19 13:41:02.409+05:30	\N
am	arm	051	ARMENIA	Armenia	\N	\N	2026-02-19 13:41:02.409+05:30	2026-02-19 13:41:02.409+05:30	\N
aw	abw	533	ARUBA	Aruba	\N	\N	2026-02-19 13:41:02.409+05:30	2026-02-19 13:41:02.409+05:30	\N
au	aus	036	AUSTRALIA	Australia	\N	\N	2026-02-19 13:41:02.409+05:30	2026-02-19 13:41:02.409+05:30	\N
at	aut	040	AUSTRIA	Austria	\N	\N	2026-02-19 13:41:02.409+05:30	2026-02-19 13:41:02.409+05:30	\N
az	aze	031	AZERBAIJAN	Azerbaijan	\N	\N	2026-02-19 13:41:02.409+05:30	2026-02-19 13:41:02.409+05:30	\N
bs	bhs	044	BAHAMAS	Bahamas	\N	\N	2026-02-19 13:41:02.409+05:30	2026-02-19 13:41:02.409+05:30	\N
bh	bhr	048	BAHRAIN	Bahrain	\N	\N	2026-02-19 13:41:02.409+05:30	2026-02-19 13:41:02.409+05:30	\N
bd	bgd	050	BANGLADESH	Bangladesh	\N	\N	2026-02-19 13:41:02.409+05:30	2026-02-19 13:41:02.409+05:30	\N
bb	brb	052	BARBADOS	Barbados	\N	\N	2026-02-19 13:41:02.409+05:30	2026-02-19 13:41:02.409+05:30	\N
by	blr	112	BELARUS	Belarus	\N	\N	2026-02-19 13:41:02.409+05:30	2026-02-19 13:41:02.409+05:30	\N
be	bel	056	BELGIUM	Belgium	\N	\N	2026-02-19 13:41:02.409+05:30	2026-02-19 13:41:02.409+05:30	\N
bz	blz	084	BELIZE	Belize	\N	\N	2026-02-19 13:41:02.409+05:30	2026-02-19 13:41:02.409+05:30	\N
bj	ben	204	BENIN	Benin	\N	\N	2026-02-19 13:41:02.409+05:30	2026-02-19 13:41:02.409+05:30	\N
bm	bmu	060	BERMUDA	Bermuda	\N	\N	2026-02-19 13:41:02.409+05:30	2026-02-19 13:41:02.409+05:30	\N
bt	btn	064	BHUTAN	Bhutan	\N	\N	2026-02-19 13:41:02.409+05:30	2026-02-19 13:41:02.409+05:30	\N
bo	bol	068	BOLIVIA	Bolivia	\N	\N	2026-02-19 13:41:02.409+05:30	2026-02-19 13:41:02.409+05:30	\N
bq	bes	535	BONAIRE, SINT EUSTATIUS AND SABA	Bonaire, Sint Eustatius and Saba	\N	\N	2026-02-19 13:41:02.409+05:30	2026-02-19 13:41:02.409+05:30	\N
ba	bih	070	BOSNIA AND HERZEGOVINA	Bosnia and Herzegovina	\N	\N	2026-02-19 13:41:02.409+05:30	2026-02-19 13:41:02.409+05:30	\N
bw	bwa	072	BOTSWANA	Botswana	\N	\N	2026-02-19 13:41:02.409+05:30	2026-02-19 13:41:02.409+05:30	\N
bv	bvd	074	BOUVET ISLAND	Bouvet Island	\N	\N	2026-02-19 13:41:02.409+05:30	2026-02-19 13:41:02.409+05:30	\N
br	bra	076	BRAZIL	Brazil	\N	\N	2026-02-19 13:41:02.409+05:30	2026-02-19 13:41:02.409+05:30	\N
io	iot	086	BRITISH INDIAN OCEAN TERRITORY	British Indian Ocean Territory	\N	\N	2026-02-19 13:41:02.409+05:30	2026-02-19 13:41:02.409+05:30	\N
bn	brn	096	BRUNEI DARUSSALAM	Brunei Darussalam	\N	\N	2026-02-19 13:41:02.409+05:30	2026-02-19 13:41:02.409+05:30	\N
bg	bgr	100	BULGARIA	Bulgaria	\N	\N	2026-02-19 13:41:02.409+05:30	2026-02-19 13:41:02.409+05:30	\N
bf	bfa	854	BURKINA FASO	Burkina Faso	\N	\N	2026-02-19 13:41:02.409+05:30	2026-02-19 13:41:02.409+05:30	\N
bi	bdi	108	BURUNDI	Burundi	\N	\N	2026-02-19 13:41:02.409+05:30	2026-02-19 13:41:02.409+05:30	\N
kh	khm	116	CAMBODIA	Cambodia	\N	\N	2026-02-19 13:41:02.409+05:30	2026-02-19 13:41:02.409+05:30	\N
cm	cmr	120	CAMEROON	Cameroon	\N	\N	2026-02-19 13:41:02.409+05:30	2026-02-19 13:41:02.409+05:30	\N
ca	can	124	CANADA	Canada	\N	\N	2026-02-19 13:41:02.409+05:30	2026-02-19 13:41:02.409+05:30	\N
cv	cpv	132	CAPE VERDE	Cape Verde	\N	\N	2026-02-19 13:41:02.409+05:30	2026-02-19 13:41:02.409+05:30	\N
ky	cym	136	CAYMAN ISLANDS	Cayman Islands	\N	\N	2026-02-19 13:41:02.409+05:30	2026-02-19 13:41:02.409+05:30	\N
cf	caf	140	CENTRAL AFRICAN REPUBLIC	Central African Republic	\N	\N	2026-02-19 13:41:02.409+05:30	2026-02-19 13:41:02.409+05:30	\N
td	tcd	148	CHAD	Chad	\N	\N	2026-02-19 13:41:02.409+05:30	2026-02-19 13:41:02.409+05:30	\N
cl	chl	152	CHILE	Chile	\N	\N	2026-02-19 13:41:02.409+05:30	2026-02-19 13:41:02.409+05:30	\N
cn	chn	156	CHINA	China	\N	\N	2026-02-19 13:41:02.409+05:30	2026-02-19 13:41:02.409+05:30	\N
cx	cxr	162	CHRISTMAS ISLAND	Christmas Island	\N	\N	2026-02-19 13:41:02.409+05:30	2026-02-19 13:41:02.409+05:30	\N
cc	cck	166	COCOS (KEELING) ISLANDS	Cocos (Keeling) Islands	\N	\N	2026-02-19 13:41:02.409+05:30	2026-02-19 13:41:02.409+05:30	\N
co	col	170	COLOMBIA	Colombia	\N	\N	2026-02-19 13:41:02.409+05:30	2026-02-19 13:41:02.409+05:30	\N
km	com	174	COMOROS	Comoros	\N	\N	2026-02-19 13:41:02.409+05:30	2026-02-19 13:41:02.409+05:30	\N
cg	cog	178	CONGO	Congo	\N	\N	2026-02-19 13:41:02.409+05:30	2026-02-19 13:41:02.409+05:30	\N
cd	cod	180	CONGO, THE DEMOCRATIC REPUBLIC OF THE	Congo, the Democratic Republic of the	\N	\N	2026-02-19 13:41:02.409+05:30	2026-02-19 13:41:02.409+05:30	\N
ck	cok	184	COOK ISLANDS	Cook Islands	\N	\N	2026-02-19 13:41:02.409+05:30	2026-02-19 13:41:02.409+05:30	\N
cr	cri	188	COSTA RICA	Costa Rica	\N	\N	2026-02-19 13:41:02.409+05:30	2026-02-19 13:41:02.409+05:30	\N
ci	civ	384	COTE D'IVOIRE	Cote D'Ivoire	\N	\N	2026-02-19 13:41:02.409+05:30	2026-02-19 13:41:02.409+05:30	\N
hr	hrv	191	CROATIA	Croatia	\N	\N	2026-02-19 13:41:02.409+05:30	2026-02-19 13:41:02.409+05:30	\N
cu	cub	192	CUBA	Cuba	\N	\N	2026-02-19 13:41:02.409+05:30	2026-02-19 13:41:02.409+05:30	\N
cw	cuw	531	CURAÇAO	Curaçao	\N	\N	2026-02-19 13:41:02.409+05:30	2026-02-19 13:41:02.409+05:30	\N
cy	cyp	196	CYPRUS	Cyprus	\N	\N	2026-02-19 13:41:02.409+05:30	2026-02-19 13:41:02.409+05:30	\N
cz	cze	203	CZECH REPUBLIC	Czech Republic	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
dk	dnk	208	DENMARK	Denmark	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
dj	dji	262	DJIBOUTI	Djibouti	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
dm	dma	212	DOMINICA	Dominica	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
do	dom	214	DOMINICAN REPUBLIC	Dominican Republic	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
ec	ecu	218	ECUADOR	Ecuador	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
eg	egy	818	EGYPT	Egypt	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
sv	slv	222	EL SALVADOR	El Salvador	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
gq	gnq	226	EQUATORIAL GUINEA	Equatorial Guinea	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
er	eri	232	ERITREA	Eritrea	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
ee	est	233	ESTONIA	Estonia	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
et	eth	231	ETHIOPIA	Ethiopia	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
fk	flk	238	FALKLAND ISLANDS (MALVINAS)	Falkland Islands (Malvinas)	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
fo	fro	234	FAROE ISLANDS	Faroe Islands	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
fj	fji	242	FIJI	Fiji	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
fi	fin	246	FINLAND	Finland	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
fr	fra	250	FRANCE	France	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
gf	guf	254	FRENCH GUIANA	French Guiana	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
pf	pyf	258	FRENCH POLYNESIA	French Polynesia	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
tf	atf	260	FRENCH SOUTHERN TERRITORIES	French Southern Territories	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
ga	gab	266	GABON	Gabon	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
gm	gmb	270	GAMBIA	Gambia	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
ge	geo	268	GEORGIA	Georgia	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
de	deu	276	GERMANY	Germany	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
gh	gha	288	GHANA	Ghana	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
gi	gib	292	GIBRALTAR	Gibraltar	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
gr	grc	300	GREECE	Greece	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
gl	grl	304	GREENLAND	Greenland	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
gd	grd	308	GRENADA	Grenada	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
gp	glp	312	GUADELOUPE	Guadeloupe	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
gu	gum	316	GUAM	Guam	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
gt	gtm	320	GUATEMALA	Guatemala	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
gg	ggy	831	GUERNSEY	Guernsey	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
gn	gin	324	GUINEA	Guinea	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
gw	gnb	624	GUINEA-BISSAU	Guinea-Bissau	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
gy	guy	328	GUYANA	Guyana	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
ht	hti	332	HAITI	Haiti	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
hm	hmd	334	HEARD ISLAND AND MCDONALD ISLANDS	Heard Island And Mcdonald Islands	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
va	vat	336	HOLY SEE (VATICAN CITY STATE)	Holy See (Vatican City State)	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
hn	hnd	340	HONDURAS	Honduras	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
hk	hkg	344	HONG KONG	Hong Kong	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
hu	hun	348	HUNGARY	Hungary	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
is	isl	352	ICELAND	Iceland	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
id	idn	360	INDONESIA	Indonesia	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
ir	irn	364	IRAN, ISLAMIC REPUBLIC OF	Iran, Islamic Republic of	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
iq	irq	368	IRAQ	Iraq	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
ie	irl	372	IRELAND	Ireland	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
im	imn	833	ISLE OF MAN	Isle Of Man	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
il	isr	376	ISRAEL	Israel	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
it	ita	380	ITALY	Italy	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
jm	jam	388	JAMAICA	Jamaica	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
jp	jpn	392	JAPAN	Japan	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
je	jey	832	JERSEY	Jersey	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
jo	jor	400	JORDAN	Jordan	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
kz	kaz	398	KAZAKHSTAN	Kazakhstan	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
ke	ken	404	KENYA	Kenya	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
ki	kir	296	KIRIBATI	Kiribati	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
kp	prk	408	KOREA, DEMOCRATIC PEOPLE'S REPUBLIC OF	Korea, Democratic People's Republic of	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
kr	kor	410	KOREA, REPUBLIC OF	Korea, Republic of	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
xk	xkx	900	KOSOVO	Kosovo	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
kw	kwt	414	KUWAIT	Kuwait	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
kg	kgz	417	KYRGYZSTAN	Kyrgyzstan	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
la	lao	418	LAO PEOPLE'S DEMOCRATIC REPUBLIC	Lao People's Democratic Republic	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
lv	lva	428	LATVIA	Latvia	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
lb	lbn	422	LEBANON	Lebanon	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
ls	lso	426	LESOTHO	Lesotho	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
lr	lbr	430	LIBERIA	Liberia	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
ly	lby	434	LIBYA	Libya	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
li	lie	438	LIECHTENSTEIN	Liechtenstein	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
lt	ltu	440	LITHUANIA	Lithuania	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
lu	lux	442	LUXEMBOURG	Luxembourg	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
mo	mac	446	MACAO	Macao	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
mg	mdg	450	MADAGASCAR	Madagascar	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
mw	mwi	454	MALAWI	Malawi	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
my	mys	458	MALAYSIA	Malaysia	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
mv	mdv	462	MALDIVES	Maldives	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
ml	mli	466	MALI	Mali	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
mt	mlt	470	MALTA	Malta	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
mh	mhl	584	MARSHALL ISLANDS	Marshall Islands	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
mq	mtq	474	MARTINIQUE	Martinique	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
mr	mrt	478	MAURITANIA	Mauritania	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
mu	mus	480	MAURITIUS	Mauritius	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
yt	myt	175	MAYOTTE	Mayotte	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
mx	mex	484	MEXICO	Mexico	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
fm	fsm	583	MICRONESIA, FEDERATED STATES OF	Micronesia, Federated States of	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
md	mda	498	MOLDOVA, REPUBLIC OF	Moldova, Republic of	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
mc	mco	492	MONACO	Monaco	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
mn	mng	496	MONGOLIA	Mongolia	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
me	mne	499	MONTENEGRO	Montenegro	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
ms	msr	500	MONTSERRAT	Montserrat	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
ma	mar	504	MOROCCO	Morocco	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
mz	moz	508	MOZAMBIQUE	Mozambique	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
mm	mmr	104	MYANMAR	Myanmar	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
na	nam	516	NAMIBIA	Namibia	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
nr	nru	520	NAURU	Nauru	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
np	npl	524	NEPAL	Nepal	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
nl	nld	528	NETHERLANDS	Netherlands	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
nc	ncl	540	NEW CALEDONIA	New Caledonia	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
nz	nzl	554	NEW ZEALAND	New Zealand	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
ni	nic	558	NICARAGUA	Nicaragua	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
ne	ner	562	NIGER	Niger	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
ng	nga	566	NIGERIA	Nigeria	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
nu	niu	570	NIUE	Niue	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
nf	nfk	574	NORFOLK ISLAND	Norfolk Island	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
mk	mkd	807	NORTH MACEDONIA	North Macedonia	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
mp	mnp	580	NORTHERN MARIANA ISLANDS	Northern Mariana Islands	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
no	nor	578	NORWAY	Norway	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
om	omn	512	OMAN	Oman	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
pk	pak	586	PAKISTAN	Pakistan	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
pw	plw	585	PALAU	Palau	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
ps	pse	275	PALESTINIAN TERRITORY, OCCUPIED	Palestinian Territory, Occupied	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
pa	pan	591	PANAMA	Panama	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
pg	png	598	PAPUA NEW GUINEA	Papua New Guinea	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
py	pry	600	PARAGUAY	Paraguay	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
pe	per	604	PERU	Peru	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
ph	phl	608	PHILIPPINES	Philippines	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
pn	pcn	612	PITCAIRN	Pitcairn	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
pl	pol	616	POLAND	Poland	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
pt	prt	620	PORTUGAL	Portugal	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
pr	pri	630	PUERTO RICO	Puerto Rico	\N	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 13:41:02.41+05:30	\N
qa	qat	634	QATAR	Qatar	\N	\N	2026-02-19 13:41:02.411+05:30	2026-02-19 13:41:02.411+05:30	\N
re	reu	638	REUNION	Reunion	\N	\N	2026-02-19 13:41:02.411+05:30	2026-02-19 13:41:02.411+05:30	\N
ro	rom	642	ROMANIA	Romania	\N	\N	2026-02-19 13:41:02.411+05:30	2026-02-19 13:41:02.411+05:30	\N
ru	rus	643	RUSSIAN FEDERATION	Russian Federation	\N	\N	2026-02-19 13:41:02.411+05:30	2026-02-19 13:41:02.411+05:30	\N
rw	rwa	646	RWANDA	Rwanda	\N	\N	2026-02-19 13:41:02.411+05:30	2026-02-19 13:41:02.411+05:30	\N
bl	blm	652	SAINT BARTHÉLEMY	Saint Barthélemy	\N	\N	2026-02-19 13:41:02.411+05:30	2026-02-19 13:41:02.411+05:30	\N
sh	shn	654	SAINT HELENA	Saint Helena	\N	\N	2026-02-19 13:41:02.411+05:30	2026-02-19 13:41:02.411+05:30	\N
kn	kna	659	SAINT KITTS AND NEVIS	Saint Kitts and Nevis	\N	\N	2026-02-19 13:41:02.411+05:30	2026-02-19 13:41:02.411+05:30	\N
lc	lca	662	SAINT LUCIA	Saint Lucia	\N	\N	2026-02-19 13:41:02.411+05:30	2026-02-19 13:41:02.411+05:30	\N
mf	maf	663	SAINT MARTIN (FRENCH PART)	Saint Martin (French part)	\N	\N	2026-02-19 13:41:02.411+05:30	2026-02-19 13:41:02.411+05:30	\N
pm	spm	666	SAINT PIERRE AND MIQUELON	Saint Pierre and Miquelon	\N	\N	2026-02-19 13:41:02.411+05:30	2026-02-19 13:41:02.411+05:30	\N
vc	vct	670	SAINT VINCENT AND THE GRENADINES	Saint Vincent and the Grenadines	\N	\N	2026-02-19 13:41:02.411+05:30	2026-02-19 13:41:02.411+05:30	\N
ws	wsm	882	SAMOA	Samoa	\N	\N	2026-02-19 13:41:02.411+05:30	2026-02-19 13:41:02.411+05:30	\N
sm	smr	674	SAN MARINO	San Marino	\N	\N	2026-02-19 13:41:02.411+05:30	2026-02-19 13:41:02.411+05:30	\N
st	stp	678	SAO TOME AND PRINCIPE	Sao Tome and Principe	\N	\N	2026-02-19 13:41:02.411+05:30	2026-02-19 13:41:02.411+05:30	\N
sa	sau	682	SAUDI ARABIA	Saudi Arabia	\N	\N	2026-02-19 13:41:02.411+05:30	2026-02-19 13:41:02.411+05:30	\N
sn	sen	686	SENEGAL	Senegal	\N	\N	2026-02-19 13:41:02.411+05:30	2026-02-19 13:41:02.411+05:30	\N
rs	srb	688	SERBIA	Serbia	\N	\N	2026-02-19 13:41:02.411+05:30	2026-02-19 13:41:02.411+05:30	\N
sc	syc	690	SEYCHELLES	Seychelles	\N	\N	2026-02-19 13:41:02.411+05:30	2026-02-19 13:41:02.411+05:30	\N
sl	sle	694	SIERRA LEONE	Sierra Leone	\N	\N	2026-02-19 13:41:02.411+05:30	2026-02-19 13:41:02.411+05:30	\N
sg	sgp	702	SINGAPORE	Singapore	\N	\N	2026-02-19 13:41:02.411+05:30	2026-02-19 13:41:02.411+05:30	\N
sx	sxm	534	SINT MAARTEN	Sint Maarten	\N	\N	2026-02-19 13:41:02.411+05:30	2026-02-19 13:41:02.411+05:30	\N
sk	svk	703	SLOVAKIA	Slovakia	\N	\N	2026-02-19 13:41:02.411+05:30	2026-02-19 13:41:02.411+05:30	\N
si	svn	705	SLOVENIA	Slovenia	\N	\N	2026-02-19 13:41:02.411+05:30	2026-02-19 13:41:02.411+05:30	\N
sb	slb	090	SOLOMON ISLANDS	Solomon Islands	\N	\N	2026-02-19 13:41:02.411+05:30	2026-02-19 13:41:02.411+05:30	\N
so	som	706	SOMALIA	Somalia	\N	\N	2026-02-19 13:41:02.411+05:30	2026-02-19 13:41:02.411+05:30	\N
za	zaf	710	SOUTH AFRICA	South Africa	\N	\N	2026-02-19 13:41:02.411+05:30	2026-02-19 13:41:02.411+05:30	\N
gs	sgs	239	SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS	South Georgia and the South Sandwich Islands	\N	\N	2026-02-19 13:41:02.411+05:30	2026-02-19 13:41:02.411+05:30	\N
ss	ssd	728	SOUTH SUDAN	South Sudan	\N	\N	2026-02-19 13:41:02.411+05:30	2026-02-19 13:41:02.411+05:30	\N
es	esp	724	SPAIN	Spain	\N	\N	2026-02-19 13:41:02.411+05:30	2026-02-19 13:41:02.411+05:30	\N
lk	lka	144	SRI LANKA	Sri Lanka	\N	\N	2026-02-19 13:41:02.411+05:30	2026-02-19 13:41:02.411+05:30	\N
sd	sdn	729	SUDAN	Sudan	\N	\N	2026-02-19 13:41:02.411+05:30	2026-02-19 13:41:02.411+05:30	\N
sr	sur	740	SURINAME	Suriname	\N	\N	2026-02-19 13:41:02.411+05:30	2026-02-19 13:41:02.411+05:30	\N
sj	sjm	744	SVALBARD AND JAN MAYEN	Svalbard and Jan Mayen	\N	\N	2026-02-19 13:41:02.411+05:30	2026-02-19 13:41:02.411+05:30	\N
sz	swz	748	SWAZILAND	Swaziland	\N	\N	2026-02-19 13:41:02.411+05:30	2026-02-19 13:41:02.411+05:30	\N
se	swe	752	SWEDEN	Sweden	\N	\N	2026-02-19 13:41:02.411+05:30	2026-02-19 13:41:02.411+05:30	\N
ch	che	756	SWITZERLAND	Switzerland	\N	\N	2026-02-19 13:41:02.411+05:30	2026-02-19 13:41:02.411+05:30	\N
sy	syr	760	SYRIAN ARAB REPUBLIC	Syrian Arab Republic	\N	\N	2026-02-19 13:41:02.411+05:30	2026-02-19 13:41:02.411+05:30	\N
tw	twn	158	TAIWAN, PROVINCE OF CHINA	Taiwan, Province of China	\N	\N	2026-02-19 13:41:02.411+05:30	2026-02-19 13:41:02.411+05:30	\N
tj	tjk	762	TAJIKISTAN	Tajikistan	\N	\N	2026-02-19 13:41:02.411+05:30	2026-02-19 13:41:02.411+05:30	\N
tz	tza	834	TANZANIA, UNITED REPUBLIC OF	Tanzania, United Republic of	\N	\N	2026-02-19 13:41:02.411+05:30	2026-02-19 13:41:02.411+05:30	\N
th	tha	764	THAILAND	Thailand	\N	\N	2026-02-19 13:41:02.411+05:30	2026-02-19 13:41:02.411+05:30	\N
tl	tls	626	TIMOR LESTE	Timor Leste	\N	\N	2026-02-19 13:41:02.411+05:30	2026-02-19 13:41:02.411+05:30	\N
tg	tgo	768	TOGO	Togo	\N	\N	2026-02-19 13:41:02.411+05:30	2026-02-19 13:41:02.411+05:30	\N
tk	tkl	772	TOKELAU	Tokelau	\N	\N	2026-02-19 13:41:02.411+05:30	2026-02-19 13:41:02.411+05:30	\N
to	ton	776	TONGA	Tonga	\N	\N	2026-02-19 13:41:02.411+05:30	2026-02-19 13:41:02.411+05:30	\N
tt	tto	780	TRINIDAD AND TOBAGO	Trinidad and Tobago	\N	\N	2026-02-19 13:41:02.411+05:30	2026-02-19 13:41:02.411+05:30	\N
tn	tun	788	TUNISIA	Tunisia	\N	\N	2026-02-19 13:41:02.411+05:30	2026-02-19 13:41:02.411+05:30	\N
tr	tur	792	TURKEY	Turkey	\N	\N	2026-02-19 13:41:02.411+05:30	2026-02-19 13:41:02.411+05:30	\N
tm	tkm	795	TURKMENISTAN	Turkmenistan	\N	\N	2026-02-19 13:41:02.411+05:30	2026-02-19 13:41:02.411+05:30	\N
tc	tca	796	TURKS AND CAICOS ISLANDS	Turks and Caicos Islands	\N	\N	2026-02-19 13:41:02.411+05:30	2026-02-19 13:41:02.411+05:30	\N
tv	tuv	798	TUVALU	Tuvalu	\N	\N	2026-02-19 13:41:02.411+05:30	2026-02-19 13:41:02.411+05:30	\N
ug	uga	800	UGANDA	Uganda	\N	\N	2026-02-19 13:41:02.411+05:30	2026-02-19 13:41:02.411+05:30	\N
ua	ukr	804	UKRAINE	Ukraine	\N	\N	2026-02-19 13:41:02.411+05:30	2026-02-19 13:41:02.411+05:30	\N
ae	are	784	UNITED ARAB EMIRATES	United Arab Emirates	\N	\N	2026-02-19 13:41:02.411+05:30	2026-02-19 13:41:02.411+05:30	\N
gb	gbr	826	UNITED KINGDOM	United Kingdom	\N	\N	2026-02-19 13:41:02.411+05:30	2026-02-19 13:41:02.411+05:30	\N
us	usa	840	UNITED STATES	United States	\N	\N	2026-02-19 13:41:02.411+05:30	2026-02-19 13:41:02.411+05:30	\N
um	umi	581	UNITED STATES MINOR OUTLYING ISLANDS	United States Minor Outlying Islands	\N	\N	2026-02-19 13:41:02.411+05:30	2026-02-19 13:41:02.411+05:30	\N
uy	ury	858	URUGUAY	Uruguay	\N	\N	2026-02-19 13:41:02.411+05:30	2026-02-19 13:41:02.411+05:30	\N
uz	uzb	860	UZBEKISTAN	Uzbekistan	\N	\N	2026-02-19 13:41:02.411+05:30	2026-02-19 13:41:02.411+05:30	\N
vu	vut	548	VANUATU	Vanuatu	\N	\N	2026-02-19 13:41:02.411+05:30	2026-02-19 13:41:02.411+05:30	\N
ve	ven	862	VENEZUELA	Venezuela	\N	\N	2026-02-19 13:41:02.411+05:30	2026-02-19 13:41:02.411+05:30	\N
vn	vnm	704	VIET NAM	Viet Nam	\N	\N	2026-02-19 13:41:02.411+05:30	2026-02-19 13:41:02.411+05:30	\N
vg	vgb	092	VIRGIN ISLANDS, BRITISH	Virgin Islands, British	\N	\N	2026-02-19 13:41:02.411+05:30	2026-02-19 13:41:02.411+05:30	\N
vi	vir	850	VIRGIN ISLANDS, U.S.	Virgin Islands, U.S.	\N	\N	2026-02-19 13:41:02.411+05:30	2026-02-19 13:41:02.411+05:30	\N
wf	wlf	876	WALLIS AND FUTUNA	Wallis and Futuna	\N	\N	2026-02-19 13:41:02.411+05:30	2026-02-19 13:41:02.411+05:30	\N
eh	esh	732	WESTERN SAHARA	Western Sahara	\N	\N	2026-02-19 13:41:02.411+05:30	2026-02-19 13:41:02.411+05:30	\N
ye	yem	887	YEMEN	Yemen	\N	\N	2026-02-19 13:41:02.411+05:30	2026-02-19 13:41:02.411+05:30	\N
zm	zmb	894	ZAMBIA	Zambia	\N	\N	2026-02-19 13:41:02.411+05:30	2026-02-19 13:41:02.411+05:30	\N
zw	zwe	716	ZIMBABWE	Zimbabwe	\N	\N	2026-02-19 13:41:02.411+05:30	2026-02-19 13:41:02.411+05:30	\N
ax	ala	248	ÅLAND ISLANDS	Åland Islands	\N	\N	2026-02-19 13:41:02.411+05:30	2026-02-19 13:41:02.411+05:30	\N
in	ind	356	INDIA	India	reg_01KHTKFY0KFEBQMJJMD734XVS0	\N	2026-02-19 13:41:02.41+05:30	2026-02-19 14:55:28.221+05:30	\N
\.


--
-- Data for Name: region_payment_provider; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.region_payment_provider (region_id, payment_provider_id, id, created_at, updated_at, deleted_at) FROM stdin;
reg_01KHTKFY0KFEBQMJJMD734XVS0	pp_system_default	regpp_01KHTKFY203QD94D6D0G7S0873	2026-02-19 14:55:28.254574+05:30	2026-02-19 14:55:28.254574+05:30	\N
reg_01KHTKFY0KFEBQMJJMD734XVS0	pp_razorpay_razorpay	regpp_01KHTRD7K195B6RMX0M98QJ3KB	2026-02-19 16:21:22.594039+05:30	2026-02-19 16:21:22.594039+05:30	\N
\.


--
-- Data for Name: reservation_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reservation_item (id, created_at, updated_at, deleted_at, line_item_id, location_id, quantity, external_id, description, created_by, metadata, inventory_item_id, allow_backorder, raw_quantity) FROM stdin;
resitem_01KHWZ6QMF6BS716VDK1V38CAC	2026-02-20 12:58:38.549+05:30	2026-02-20 14:22:14.829+05:30	2026-02-20 14:22:14.812+05:30	ordli_01KHWZ6QHAXPSPDF5Z6WBM5A8K	sloc_01KHTKFY2C5P1JPMTTXXM6BQTB	1	\N	\N	\N	\N	iitem_01KHTKFYCTCB81PDCQMX1QS4HN	f	{"value": "1", "precision": 20}
resitem_01KHTRQT6D2M0JBZZK43T0FSTP	2026-02-19 16:27:09.333+05:30	2026-02-20 17:56:40.534+05:30	2026-02-20 17:56:40.517+05:30	ordli_01KHTRQT2KY54K00QSF4W0ZWKS	sloc_01KHTKFY2C5P1JPMTTXXM6BQTB	1	\N	\N	\N	\N	iitem_01KHTKFYCSC5JZKQ4Y9KV4CNMM	f	{"value": "1", "precision": 20}
resitem_01KJ010SP9Y7MQBT225VP0TG9J	2026-02-21 17:28:04.502+05:30	2026-02-21 17:28:04.502+05:30	\N	ordli_01KJ010SJJ557WCHTFST6X7NMH	sloc_01KHTKFY2C5P1JPMTTXXM6BQTB	1	\N	\N	\N	\N	iitem_01KHTKFYCSC5JZKQ4Y9KV4CNMM	f	{"value": "1", "precision": 20}
\.


--
-- Data for Name: return; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.return (id, order_id, claim_id, exchange_id, order_version, display_id, status, no_notification, refund_amount, raw_refund_amount, metadata, created_at, updated_at, deleted_at, received_at, canceled_at, location_id, requested_at, created_by) FROM stdin;
\.


--
-- Data for Name: return_fulfillment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.return_fulfillment (return_id, fulfillment_id, id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: return_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.return_item (id, return_id, reason_id, item_id, quantity, raw_quantity, received_quantity, raw_received_quantity, note, metadata, created_at, updated_at, deleted_at, damaged_quantity, raw_damaged_quantity) FROM stdin;
\.


--
-- Data for Name: return_reason; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.return_reason (id, value, label, description, metadata, parent_return_reason_id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: sales_channel; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sales_channel (id, name, description, is_disabled, metadata, created_at, updated_at, deleted_at) FROM stdin;
sc_01KHTF8JGN9HZWVEK942B6AAGQ	Default Sales Channel	Created by Medusa	f	\N	2026-02-19 13:41:32.757+05:30	2026-02-19 13:41:32.757+05:30	\N
\.


--
-- Data for Name: sales_channel_stock_location; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sales_channel_stock_location (sales_channel_id, stock_location_id, id, created_at, updated_at, deleted_at) FROM stdin;
sc_01KHTF8JGN9HZWVEK942B6AAGQ	sloc_01KHTKFY2C5P1JPMTTXXM6BQTB	scloc_01KHTQ13PG1PZV3QW11M5EKQ52	2026-02-19 15:57:16.815564+05:30	2026-02-19 15:57:16.815564+05:30	\N
\.


--
-- Data for Name: script_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.script_migrations (id, script_name, created_at, finished_at) FROM stdin;
1	migrate-product-shipping-profile.js	2026-02-19 13:41:04.085366+05:30	2026-02-19 13:41:04.125601+05:30
2	migrate-tax-region-provider.js	2026-02-19 13:41:04.129515+05:30	2026-02-19 13:41:04.141821+05:30
\.


--
-- Data for Name: service_zone; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.service_zone (id, name, metadata, fulfillment_set_id, created_at, updated_at, deleted_at) FROM stdin;
serzo_01KHTKFY3CBKYV2YREWNWF6NPX	India	\N	fuset_01KHTKFY3C0W15HWPCFPD8SMA2	2026-02-19 14:55:28.3+05:30	2026-02-19 14:55:28.3+05:30	\N
\.


--
-- Data for Name: shipping_option; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.shipping_option (id, name, price_type, service_zone_id, shipping_profile_id, provider_id, data, metadata, shipping_option_type_id, created_at, updated_at, deleted_at) FROM stdin;
so_01KHTKFY58XNN3M9WYSRN52W9P	Standard Shipping	flat	serzo_01KHTKFY3CBKYV2YREWNWF6NPX	sp_01KHTF7PHNV7K4NX7KYCPW6WY1	manual_manual	\N	\N	sotype_01KHTKFY57N35H21X0P9KH1T3G	2026-02-19 14:55:28.361+05:30	2026-02-19 14:55:28.361+05:30	\N
\.


--
-- Data for Name: shipping_option_price_set; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.shipping_option_price_set (shipping_option_id, price_set_id, id, created_at, updated_at, deleted_at) FROM stdin;
so_01KHTKFY58XNN3M9WYSRN52W9P	pset_01KHTKFY64GE8CCS4R3RZTGKJ4	sops_01KHTKFY792YQMHJXH7EG7XVSH	2026-02-19 14:55:28.424781+05:30	2026-02-19 14:55:28.424781+05:30	\N
\.


--
-- Data for Name: shipping_option_rule; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.shipping_option_rule (id, attribute, operator, value, shipping_option_id, created_at, updated_at, deleted_at) FROM stdin;
sorul_01KHTKFY58ZEJ4H7BTNE49N2CK	enabled_in_store	eq	"true"	so_01KHTKFY58XNN3M9WYSRN52W9P	2026-02-19 14:55:28.361+05:30	2026-02-19 14:55:28.361+05:30	\N
sorul_01KHTKFY584E8R8DHX2SVSH9FN	is_return	eq	"false"	so_01KHTKFY58XNN3M9WYSRN52W9P	2026-02-19 14:55:28.361+05:30	2026-02-19 14:55:28.361+05:30	\N
\.


--
-- Data for Name: shipping_option_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.shipping_option_type (id, label, description, code, created_at, updated_at, deleted_at) FROM stdin;
sotype_01KHTKFY57N35H21X0P9KH1T3G	Standard	Standard delivery	standard	2026-02-19 14:55:28.361+05:30	2026-02-19 14:55:28.361+05:30	\N
\.


--
-- Data for Name: shipping_profile; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.shipping_profile (id, name, type, metadata, created_at, updated_at, deleted_at) FROM stdin;
sp_01KHTF7PHNV7K4NX7KYCPW6WY1	Default Shipping Profile	default	\N	2026-02-19 13:41:04.117+05:30	2026-02-19 13:41:04.117+05:30	\N
\.


--
-- Data for Name: stock_location; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stock_location (id, created_at, updated_at, deleted_at, name, address_id, metadata) FROM stdin;
sloc_01KHTKFY2C5P1JPMTTXXM6BQTB	2026-02-19 14:55:28.269+05:30	2026-02-19 14:55:28.269+05:30	\N	Main Warehouse	laddr_01KHTKFY2CVCMZPYFKSXFSKT2K	\N
\.


--
-- Data for Name: stock_location_address; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stock_location_address (id, created_at, updated_at, deleted_at, address_1, address_2, company, city, country_code, phone, province, postal_code, metadata) FROM stdin;
laddr_01KHTKFY2CVCMZPYFKSXFSKT2K	2026-02-19 14:55:28.268+05:30	2026-02-19 14:55:28.268+05:30	\N	Warehouse 1	\N	\N	Indore	IN	\N	\N	\N	\N
\.


--
-- Data for Name: store; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.store (id, name, default_sales_channel_id, default_region_id, default_location_id, metadata, created_at, updated_at, deleted_at) FROM stdin;
store_01KHTF8JQWPE0037KAXD5B8PW0	Medusa Store	sc_01KHTF8JGN9HZWVEK942B6AAGQ	\N	sloc_01KHTKFY2C5P1JPMTTXXM6BQTB	\N	2026-02-19 13:41:32.981969+05:30	2026-02-19 13:41:32.981969+05:30	\N
\.


--
-- Data for Name: store_currency; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.store_currency (id, currency_code, is_default, store_id, created_at, updated_at, deleted_at) FROM stdin;
stocur_01KHTKFXZXXF7VJMSA8ASJTBCA	inr	t	store_01KHTF8JQWPE0037KAXD5B8PW0	2026-02-19 14:55:28.183298+05:30	2026-02-19 14:55:28.183298+05:30	\N
stocur_01KHTKFXZY3V3HDZBWRH02NBQT	usd	f	store_01KHTF8JQWPE0037KAXD5B8PW0	2026-02-19 14:55:28.183298+05:30	2026-02-19 14:55:28.183298+05:30	\N
\.


--
-- Data for Name: store_locale; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.store_locale (id, locale_code, store_id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: tax_provider; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tax_provider (id, is_enabled, created_at, updated_at, deleted_at) FROM stdin;
tp_system	t	2026-02-19 13:41:02.479+05:30	2026-02-19 13:41:02.479+05:30	\N
\.


--
-- Data for Name: tax_rate; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tax_rate (id, rate, code, name, is_default, is_combinable, tax_region_id, metadata, created_at, updated_at, created_by, deleted_at) FROM stdin;
\.


--
-- Data for Name: tax_rate_rule; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tax_rate_rule (id, tax_rate_id, reference_id, reference, metadata, created_at, updated_at, created_by, deleted_at) FROM stdin;
\.


--
-- Data for Name: tax_region; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tax_region (id, provider_id, country_code, province_code, parent_id, metadata, created_at, updated_at, created_by, deleted_at) FROM stdin;
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."user" (id, first_name, last_name, email, avatar_url, metadata, created_at, updated_at, deleted_at) FROM stdin;
user_01KHTHDMKRKCMMC98H0SEX0NPY	\N	\N	admin@admin.com	\N	\N	2026-02-19 14:19:15.896+05:30	2026-02-19 14:19:15.896+05:30	\N
user_01KJ4KE2PY1PGV1TX2ESB213ZC	\N	\N	admin@gheelocal.com	\N	\N	2026-02-23 12:06:51.807+05:30	2026-02-23 12:06:51.807+05:30	\N
user_01KJ4KVW3R8RZSNH0Q3ZFVQ2R8	\N	\N	admin@local.com	\N	\N	2026-02-23 12:14:23.8+05:30	2026-02-23 12:14:23.8+05:30	\N
\.


--
-- Data for Name: user_preference; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_preference (id, user_id, key, value, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: user_rbac_role; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_rbac_role (user_id, rbac_role_id, id, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: view_configuration; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.view_configuration (id, entity, name, user_id, is_system_default, configuration, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: workflow_execution; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.workflow_execution (id, workflow_id, transaction_id, execution, context, state, created_at, updated_at, deleted_at, retention_time, run_id) FROM stdin;
wf_exec_01KJ010SEA5DBK5AR9PK2KBY4A	complete-cart	auto-01KJ010SDXRZY0G89P674GJ240	{"_v": 0, "runId": "01KJ010SE0YKEPG88M4WR3DQF3", "state": "done", "steps": {"_root": {"id": "_root", "next": ["_root.acquire-lock-step"]}, "_root.acquire-lock-step": {"_v": 0, "id": "_root.acquire-lock-step", "next": ["_root.acquire-lock-step.use-query-graph-step", "_root.acquire-lock-step.cart-query"], "uuid": "01KHZS6YGFVC97VZ7G4TYV861E", "depth": 1, "invoke": {"state": "done", "status": "ok"}, "attempts": 1, "failures": 0, "startedAt": 1771675084261, "compensate": {"state": "dormant", "status": "idle"}, "definition": {"uuid": "01KHZS6YGFVC97VZ7G4TYV861E", "store": false, "action": "acquire-lock-step", "noCompensation": false}, "stepFailed": false, "lastAttempt": 1771675084261, "saveResponse": true}, "_root.acquire-lock-step.cart-query": {"_v": 0, "id": "_root.acquire-lock-step.cart-query", "next": ["_root.acquire-lock-step.cart-query.validate-cart-payments"], "uuid": "01KHZS6YGF1HR7XA5VHV384V2W", "depth": 2, "invoke": {"state": "done", "status": "ok"}, "attempts": 1, "failures": 0, "startedAt": 1771675084264, "compensate": {"state": "dormant", "status": "idle"}, "definition": {"uuid": "01KHZS6YGF1HR7XA5VHV384V2W", "async": false, "store": false, "action": "cart-query", "noCompensation": true, "compensateAsync": false}, "stepFailed": false, "lastAttempt": 1771675084264, "saveResponse": true}, "_root.acquire-lock-step.use-query-graph-step": {"_v": 0, "id": "_root.acquire-lock-step.use-query-graph-step", "next": [], "uuid": "01KHZS6YGFWB7XMRR92EQRCWNB", "depth": 2, "invoke": {"state": "done", "status": "ok"}, "attempts": 1, "failures": 0, "startedAt": 1771675084264, "compensate": {"state": "dormant", "status": "idle"}, "definition": {"uuid": "01KHZS6YGFWB7XMRR92EQRCWNB", "store": false, "action": "use-query-graph-step", "noCompensation": true}, "stepFailed": false, "lastAttempt": 1771675084264, "saveResponse": true}, "_root.acquire-lock-step.cart-query.validate-cart-payments": {"_v": 0, "id": "_root.acquire-lock-step.cart-query.validate-cart-payments", "next": ["_root.acquire-lock-step.cart-query.validate-cart-payments.compensate-payment-if-needed"], "uuid": "01KHZS6YGG9N5SNRCYT5GC4ZFY", "depth": 3, "invoke": {"state": "done", "status": "ok"}, "attempts": 1, "failures": 0, "startedAt": 1771675084328, "compensate": {"state": "dormant", "status": "idle"}, "definition": {"uuid": "01KHZS6YGG9N5SNRCYT5GC4ZFY", "store": false, "action": "validate-cart-payments", "noCompensation": true}, "stepFailed": false, "lastAttempt": 1771675084328, "saveResponse": true}, "_root.acquire-lock-step.cart-query.validate-cart-payments.compensate-payment-if-needed": {"_v": 0, "id": "_root.acquire-lock-step.cart-query.validate-cart-payments.compensate-payment-if-needed", "next": ["_root.acquire-lock-step.cart-query.validate-cart-payments.compensate-payment-if-needed.validate"], "uuid": "01KHZS6YGGM7PN35W90ZVVEMPM", "depth": 4, "invoke": {"state": "done", "status": "ok"}, "attempts": 1, "failures": 0, "startedAt": 1771675084336, "compensate": {"state": "dormant", "status": "idle"}, "definition": {"uuid": "01KHZS6YGGM7PN35W90ZVVEMPM", "store": false, "action": "compensate-payment-if-needed", "noCompensation": false}, "stepFailed": false, "lastAttempt": 1771675084336, "saveResponse": true}, "_root.acquire-lock-step.cart-query.validate-cart-payments.compensate-payment-if-needed.validate": {"_v": 0, "id": "_root.acquire-lock-step.cart-query.validate-cart-payments.compensate-payment-if-needed.validate", "next": ["_root.acquire-lock-step.cart-query.validate-cart-payments.compensate-payment-if-needed.validate.shipping-options-query"], "uuid": "01KHZS6YGG4R8Q2BFC70ZDFHZK", "depth": 5, "invoke": {"state": "done", "status": "ok"}, "attempts": 1, "failures": 0, "startedAt": 1771675084339, "compensate": {"state": "dormant", "status": "idle"}, "definition": {"uuid": "01KHZS6YGG4R8Q2BFC70ZDFHZK", "store": false, "action": "validate", "noCompensation": false}, "stepFailed": false, "lastAttempt": 1771675084339, "saveResponse": true}, "_root.acquire-lock-step.cart-query.validate-cart-payments.compensate-payment-if-needed.validate.shipping-options-query": {"_v": 0, "id": "_root.acquire-lock-step.cart-query.validate-cart-payments.compensate-payment-if-needed.validate.shipping-options-query", "next": ["_root.acquire-lock-step.cart-query.validate-cart-payments.compensate-payment-if-needed.validate.shipping-options-query.validate-shipping"], "uuid": "01KHZS6YGG36WEYG3MRRZF266M", "depth": 6, "invoke": {"state": "done", "status": "ok"}, "attempts": 1, "failures": 0, "startedAt": 1771675084342, "compensate": {"state": "dormant", "status": "idle"}, "definition": {"uuid": "01KHZS6YGG36WEYG3MRRZF266M", "async": false, "store": false, "action": "shipping-options-query", "noCompensation": true, "compensateAsync": false}, "stepFailed": false, "lastAttempt": 1771675084342, "saveResponse": true}, "_root.acquire-lock-step.cart-query.validate-cart-payments.compensate-payment-if-needed.validate.shipping-options-query.validate-shipping": {"_v": 0, "id": "_root.acquire-lock-step.cart-query.validate-cart-payments.compensate-payment-if-needed.validate.shipping-options-query.validate-shipping", "next": ["_root.acquire-lock-step.cart-query.validate-cart-payments.compensate-payment-if-needed.validate.shipping-options-query.validate-shipping.create-orders"], "uuid": "01KHZS6YGGHZ2MG4DYPMA38V1E", "depth": 7, "invoke": {"state": "done", "status": "ok"}, "attempts": 1, "failures": 0, "startedAt": 1771675084352, "compensate": {"state": "dormant", "status": "idle"}, "definition": {"uuid": "01KHZS6YGGHZ2MG4DYPMA38V1E", "store": false, "action": "validate-shipping", "noCompensation": true}, "stepFailed": false, "lastAttempt": 1771675084352, "saveResponse": true}, "_root.acquire-lock-step.cart-query.validate-cart-payments.compensate-payment-if-needed.validate.shipping-options-query.validate-shipping.create-orders": {"_v": 0, "id": "_root.acquire-lock-step.cart-query.validate-cart-payments.compensate-payment-if-needed.validate.shipping-options-query.validate-shipping.create-orders", "next": ["_root.acquire-lock-step.cart-query.validate-cart-payments.compensate-payment-if-needed.validate.shipping-options-query.validate-shipping.create-orders.create-remote-links", "_root.acquire-lock-step.cart-query.validate-cart-payments.compensate-payment-if-needed.validate.shipping-options-query.validate-shipping.create-orders.update-carts", "_root.acquire-lock-step.cart-query.validate-cart-payments.compensate-payment-if-needed.validate.shipping-options-query.validate-shipping.create-orders.reserve-inventory-step", "_root.acquire-lock-step.cart-query.validate-cart-payments.compensate-payment-if-needed.validate.shipping-options-query.validate-shipping.create-orders.register-usage", "_root.acquire-lock-step.cart-query.validate-cart-payments.compensate-payment-if-needed.validate.shipping-options-query.validate-shipping.create-orders.emit-event-step"], "uuid": "01KHZS6YGH6FBG321ZBPXQHW5V", "depth": 8, "invoke": {"state": "done", "status": "ok"}, "attempts": 1, "failures": 0, "startedAt": 1771675084357, "compensate": {"state": "dormant", "status": "idle"}, "definition": {"uuid": "01KHZS6YGH6FBG321ZBPXQHW5V", "store": false, "action": "create-orders", "noCompensation": false}, "stepFailed": false, "lastAttempt": 1771675084357, "saveResponse": true}, "_root.acquire-lock-step.cart-query.validate-cart-payments.compensate-payment-if-needed.validate.shipping-options-query.validate-shipping.create-orders.update-carts": {"_v": 0, "id": "_root.acquire-lock-step.cart-query.validate-cart-payments.compensate-payment-if-needed.validate.shipping-options-query.validate-shipping.create-orders.update-carts", "next": [], "uuid": "01KHZS6YGH7JP5SJGN73QJ3R7K", "depth": 9, "invoke": {"state": "done", "status": "ok"}, "attempts": 1, "failures": 0, "startedAt": 1771675084453, "compensate": {"state": "dormant", "status": "idle"}, "definition": {"uuid": "01KHZS6YGH7JP5SJGN73QJ3R7K", "store": false, "action": "update-carts", "noCompensation": false}, "stepFailed": false, "lastAttempt": 1771675084453, "saveResponse": true}, "_root.acquire-lock-step.cart-query.validate-cart-payments.compensate-payment-if-needed.validate.shipping-options-query.validate-shipping.create-orders.register-usage": {"_v": 0, "id": "_root.acquire-lock-step.cart-query.validate-cart-payments.compensate-payment-if-needed.validate.shipping-options-query.validate-shipping.create-orders.register-usage", "next": [], "uuid": "01KHZS6YGHDVEK7MW30ZCY02K2", "depth": 9, "invoke": {"state": "done", "status": "ok"}, "attempts": 1, "failures": 0, "startedAt": 1771675084453, "compensate": {"state": "dormant", "status": "idle"}, "definition": {"uuid": "01KHZS6YGHDVEK7MW30ZCY02K2", "store": false, "action": "register-usage", "noCompensation": false}, "stepFailed": false, "lastAttempt": 1771675084453, "saveResponse": true}, "_root.acquire-lock-step.cart-query.validate-cart-payments.compensate-payment-if-needed.validate.shipping-options-query.validate-shipping.create-orders.emit-event-step": {"_v": 0, "id": "_root.acquire-lock-step.cart-query.validate-cart-payments.compensate-payment-if-needed.validate.shipping-options-query.validate-shipping.create-orders.emit-event-step", "next": ["_root.acquire-lock-step.cart-query.validate-cart-payments.compensate-payment-if-needed.validate.shipping-options-query.validate-shipping.create-orders.emit-event-step.beforePaymentAuthorization"], "uuid": "01KHZS6YGH90EXSF8QQKC0YP1Y", "depth": 9, "invoke": {"state": "done", "status": "ok"}, "attempts": 1, "failures": 0, "startedAt": 1771675084453, "compensate": {"state": "dormant", "status": "idle"}, "definition": {"uuid": "01KHZS6YGH90EXSF8QQKC0YP1Y", "store": false, "action": "emit-event-step", "noCompensation": false}, "stepFailed": false, "lastAttempt": 1771675084453, "saveResponse": true}, "_root.acquire-lock-step.cart-query.validate-cart-payments.compensate-payment-if-needed.validate.shipping-options-query.validate-shipping.create-orders.create-remote-links": {"_v": 0, "id": "_root.acquire-lock-step.cart-query.validate-cart-payments.compensate-payment-if-needed.validate.shipping-options-query.validate-shipping.create-orders.create-remote-links", "next": [], "uuid": "01KHZS6YGHH86DS361FD1V858Q", "depth": 9, "invoke": {"state": "done", "status": "ok"}, "attempts": 1, "failures": 0, "startedAt": 1771675084453, "compensate": {"state": "dormant", "status": "idle"}, "definition": {"uuid": "01KHZS6YGHH86DS361FD1V858Q", "store": false, "action": "create-remote-links", "noCompensation": false}, "stepFailed": false, "lastAttempt": 1771675084453, "saveResponse": true}, "_root.acquire-lock-step.cart-query.validate-cart-payments.compensate-payment-if-needed.validate.shipping-options-query.validate-shipping.create-orders.reserve-inventory-step": {"_v": 0, "id": "_root.acquire-lock-step.cart-query.validate-cart-payments.compensate-payment-if-needed.validate.shipping-options-query.validate-shipping.create-orders.reserve-inventory-step", "next": [], "uuid": "01KHZS6YGHPN4VQGVQK1FM7Y0E", "depth": 9, "invoke": {"state": "done", "status": "ok"}, "attempts": 1, "failures": 0, "startedAt": 1771675084453, "compensate": {"state": "dormant", "status": "idle"}, "definition": {"uuid": "01KHZS6YGHPN4VQGVQK1FM7Y0E", "store": false, "action": "reserve-inventory-step", "noCompensation": false}, "stepFailed": false, "lastAttempt": 1771675084453, "saveResponse": true}, "_root.acquire-lock-step.cart-query.validate-cart-payments.compensate-payment-if-needed.validate.shipping-options-query.validate-shipping.create-orders.emit-event-step.beforePaymentAuthorization": {"_v": 0, "id": "_root.acquire-lock-step.cart-query.validate-cart-payments.compensate-payment-if-needed.validate.shipping-options-query.validate-shipping.create-orders.emit-event-step.beforePaymentAuthorization", "next": ["_root.acquire-lock-step.cart-query.validate-cart-payments.compensate-payment-if-needed.validate.shipping-options-query.validate-shipping.create-orders.emit-event-step.beforePaymentAuthorization.authorize-payment-session-step"], "uuid": "01KHZS6YGHEHNVWKT19J90WCEX", "depth": 10, "invoke": {"state": "done", "status": "ok"}, "attempts": 1, "failures": 0, "startedAt": 1771675084517, "compensate": {"state": "dormant", "status": "idle"}, "definition": {"uuid": "01KHZS6YGHEHNVWKT19J90WCEX", "store": false, "action": "beforePaymentAuthorization", "noCompensation": false}, "stepFailed": false, "lastAttempt": 1771675084517, "saveResponse": true}, "_root.acquire-lock-step.cart-query.validate-cart-payments.compensate-payment-if-needed.validate.shipping-options-query.validate-shipping.create-orders.emit-event-step.beforePaymentAuthorization.authorize-payment-session-step": {"_v": 0, "id": "_root.acquire-lock-step.cart-query.validate-cart-payments.compensate-payment-if-needed.validate.shipping-options-query.validate-shipping.create-orders.emit-event-step.beforePaymentAuthorization.authorize-payment-session-step", "next": ["_root.acquire-lock-step.cart-query.validate-cart-payments.compensate-payment-if-needed.validate.shipping-options-query.validate-shipping.create-orders.emit-event-step.beforePaymentAuthorization.authorize-payment-session-step.add-order-transaction"], "uuid": "01KHZS6YGHD4M35442DWRA4484", "depth": 11, "invoke": {"state": "done", "status": "ok"}, "attempts": 1, "failures": 0, "startedAt": 1771675084521, "compensate": {"state": "dormant", "status": "idle"}, "definition": {"uuid": "01KHZS6YGHD4M35442DWRA4484", "store": false, "action": "authorize-payment-session-step", "noCompensation": false}, "stepFailed": false, "lastAttempt": 1771675084521, "saveResponse": true}, "_root.acquire-lock-step.cart-query.validate-cart-payments.compensate-payment-if-needed.validate.shipping-options-query.validate-shipping.create-orders.emit-event-step.beforePaymentAuthorization.authorize-payment-session-step.add-order-transaction": {"_v": 0, "id": "_root.acquire-lock-step.cart-query.validate-cart-payments.compensate-payment-if-needed.validate.shipping-options-query.validate-shipping.create-orders.emit-event-step.beforePaymentAuthorization.authorize-payment-session-step.add-order-transaction", "next": ["_root.acquire-lock-step.cart-query.validate-cart-payments.compensate-payment-if-needed.validate.shipping-options-query.validate-shipping.create-orders.emit-event-step.beforePaymentAuthorization.authorize-payment-session-step.add-order-transaction.orderCreated"], "uuid": "01KHZS6YGHF272R17W1CDDYSZ0", "depth": 12, "invoke": {"state": "done", "status": "ok"}, "attempts": 1, "failures": 0, "startedAt": 1771675085482, "compensate": {"state": "dormant", "status": "idle"}, "definition": {"uuid": "01KHZS6YGHF272R17W1CDDYSZ0", "store": false, "action": "add-order-transaction", "noCompensation": false}, "stepFailed": false, "lastAttempt": 1771675085482, "saveResponse": true}, "_root.acquire-lock-step.cart-query.validate-cart-payments.compensate-payment-if-needed.validate.shipping-options-query.validate-shipping.create-orders.emit-event-step.beforePaymentAuthorization.authorize-payment-session-step.add-order-transaction.orderCreated": {"_v": 0, "id": "_root.acquire-lock-step.cart-query.validate-cart-payments.compensate-payment-if-needed.validate.shipping-options-query.validate-shipping.create-orders.emit-event-step.beforePaymentAuthorization.authorize-payment-session-step.add-order-transaction.orderCreated", "next": ["_root.acquire-lock-step.cart-query.validate-cart-payments.compensate-payment-if-needed.validate.shipping-options-query.validate-shipping.create-orders.emit-event-step.beforePaymentAuthorization.authorize-payment-session-step.add-order-transaction.orderCreated.create-order"], "uuid": "01KHZS6YGHDXXQW7JR88J4BXN5", "depth": 13, "invoke": {"state": "done", "status": "ok"}, "attempts": 1, "failures": 0, "startedAt": 1771675085516, "compensate": {"state": "dormant", "status": "idle"}, "definition": {"uuid": "01KHZS6YGHDXXQW7JR88J4BXN5", "store": false, "action": "orderCreated", "noCompensation": false}, "stepFailed": false, "lastAttempt": 1771675085516, "saveResponse": true}, "_root.acquire-lock-step.cart-query.validate-cart-payments.compensate-payment-if-needed.validate.shipping-options-query.validate-shipping.create-orders.emit-event-step.beforePaymentAuthorization.authorize-payment-session-step.add-order-transaction.orderCreated.create-order": {"_v": 0, "id": "_root.acquire-lock-step.cart-query.validate-cart-payments.compensate-payment-if-needed.validate.shipping-options-query.validate-shipping.create-orders.emit-event-step.beforePaymentAuthorization.authorize-payment-session-step.add-order-transaction.orderCreated.create-order", "next": ["_root.acquire-lock-step.cart-query.validate-cart-payments.compensate-payment-if-needed.validate.shipping-options-query.validate-shipping.create-orders.emit-event-step.beforePaymentAuthorization.authorize-payment-session-step.add-order-transaction.orderCreated.create-order.release-lock-step"], "uuid": "01KHZS6YGJPVRC7DCFZHD35KHR", "depth": 14, "invoke": {"state": "done", "status": "ok"}, "attempts": 1, "failures": 0, "startedAt": 1771675085520, "compensate": {"state": "dormant", "status": "idle"}, "definition": {"uuid": "01KHZS6YGJPVRC7DCFZHD35KHR", "store": false, "action": "create-order", "noCompensation": true}, "stepFailed": false, "lastAttempt": 1771675085520, "saveResponse": true}, "_root.acquire-lock-step.cart-query.validate-cart-payments.compensate-payment-if-needed.validate.shipping-options-query.validate-shipping.create-orders.emit-event-step.beforePaymentAuthorization.authorize-payment-session-step.add-order-transaction.orderCreated.create-order.release-lock-step": {"_v": 0, "id": "_root.acquire-lock-step.cart-query.validate-cart-payments.compensate-payment-if-needed.validate.shipping-options-query.validate-shipping.create-orders.emit-event-step.beforePaymentAuthorization.authorize-payment-session-step.add-order-transaction.orderCreated.create-order.release-lock-step", "next": [], "uuid": "01KHZS6YGJXNZFXC2W63ZDP7DS", "depth": 15, "invoke": {"state": "done", "status": "ok"}, "attempts": 1, "failures": 0, "startedAt": 1771675085526, "compensate": {"state": "dormant", "status": "idle"}, "definition": {"uuid": "01KHZS6YGJXNZFXC2W63ZDP7DS", "store": false, "action": "release-lock-step", "noCompensation": true}, "stepFailed": false, "lastAttempt": 1771675085526, "saveResponse": true}}, "modelId": "complete-cart", "options": {"name": "complete-cart", "store": true, "idempotent": false, "retentionTime": 259200}, "metadata": {"sourcePath": "E:\\\\Neeraj\\\\Ghee-main\\\\my-medusa-store\\\\node_modules\\\\@medusajs\\\\core-flows\\\\dist\\\\cart\\\\workflows\\\\complete-cart.js", "eventGroupId": "01KJ010SDXQ2P6GN1R01DQ8SE8", "preventReleaseEvents": false}, "startedAt": 1771675084259, "definition": {"next": [{"uuid": "01KHZS6YGFWB7XMRR92EQRCWNB", "action": "use-query-graph-step", "noCompensation": true}, {"next": {"next": {"next": {"next": {"next": {"next": {"next": [{"uuid": "01KHZS6YGHH86DS361FD1V858Q", "action": "create-remote-links", "noCompensation": false}, {"uuid": "01KHZS6YGH7JP5SJGN73QJ3R7K", "action": "update-carts", "noCompensation": false}, {"uuid": "01KHZS6YGHPN4VQGVQK1FM7Y0E", "action": "reserve-inventory-step", "noCompensation": false}, {"uuid": "01KHZS6YGHDVEK7MW30ZCY02K2", "action": "register-usage", "noCompensation": false}, {"next": {"next": {"next": {"next": {"next": {"next": {"uuid": "01KHZS6YGJXNZFXC2W63ZDP7DS", "action": "release-lock-step", "noCompensation": true}, "uuid": "01KHZS6YGJPVRC7DCFZHD35KHR", "action": "create-order", "noCompensation": true}, "uuid": "01KHZS6YGHDXXQW7JR88J4BXN5", "action": "orderCreated", "noCompensation": false}, "uuid": "01KHZS6YGHF272R17W1CDDYSZ0", "action": "add-order-transaction", "noCompensation": false}, "uuid": "01KHZS6YGHD4M35442DWRA4484", "action": "authorize-payment-session-step", "noCompensation": false}, "uuid": "01KHZS6YGHEHNVWKT19J90WCEX", "action": "beforePaymentAuthorization", "noCompensation": false}, "uuid": "01KHZS6YGH90EXSF8QQKC0YP1Y", "action": "emit-event-step", "noCompensation": false}], "uuid": "01KHZS6YGH6FBG321ZBPXQHW5V", "action": "create-orders", "noCompensation": false}, "uuid": "01KHZS6YGGHZ2MG4DYPMA38V1E", "action": "validate-shipping", "noCompensation": true}, "uuid": "01KHZS6YGG36WEYG3MRRZF266M", "async": false, "action": "shipping-options-query", "noCompensation": true, "compensateAsync": false}, "uuid": "01KHZS6YGG4R8Q2BFC70ZDFHZK", "action": "validate", "noCompensation": false}, "uuid": "01KHZS6YGGM7PN35W90ZVVEMPM", "action": "compensate-payment-if-needed", "noCompensation": false}, "uuid": "01KHZS6YGG9N5SNRCYT5GC4ZFY", "action": "validate-cart-payments", "noCompensation": true}, "uuid": "01KHZS6YGF1HR7XA5VHV384V2W", "async": false, "action": "cart-query", "noCompensation": true, "compensateAsync": false}], "uuid": "01KHZS6YGFVC97VZ7G4TYV861E", "action": "acquire-lock-step", "noCompensation": false}, "timedOutAt": null, "hasAsyncSteps": false, "transactionId": "auto-01KJ010SDXRZY0G89P674GJ240", "hasFailedSteps": false, "hasSkippedSteps": false, "hasWaitingSteps": false, "hasRevertedSteps": false, "hasSkippedOnFailureSteps": false}	{"data": {"invoke": {"validate": {"__type": "Symbol(WorkflowWorkflowData)", "output": {"__type": "Symbol(WorkflowStepResponse)"}}, "cart-query": {"__type": "Symbol(WorkflowWorkflowData)", "output": {"__type": "Symbol(WorkflowStepResponse)", "output": {"data": {"id": "cart_01KJ00X27TJN0NCJBRFSTM050G", "email": "chetan.novarsis@gmail.com", "items": [{"id": "cali_01KJ00X2K4YD541FX5C4TENG5A", "title": "Multigrain Atta", "total": 180, "cart_id": "cart_01KJ00X27TJN0NCJBRFSTM050G", "variant": {"id": "variant_01KHTKFYBZ5CC78V7V83N6PEYA", "product": {"id": "prod_01KHTKFY8VDC4G7YD60DP3RVC1", "is_giftcard": false, "shipping_profile": {"id": "sp_01KHTF7PHNV7K4NX7KYCPW6WY1"}}, "product_id": "prod_01KHTKFY8VDC4G7YD60DP3RVC1", "allow_backorder": false, "inventory_items": [{"inventory": {"id": "iitem_01KHTKFYCSC5JZKQ4Y9KV4CNMM", "location_levels": [{"location_id": "sloc_01KHTKFY2C5P1JPMTTXXM6BQTB", "stock_locations": [{"id": "sloc_01KHTKFY2C5P1JPMTTXXM6BQTB", "name": "Main Warehouse", "sales_channels": [{"id": "sc_01KHTF8JGN9HZWVEK942B6AAGQ", "name": "Default Sales Channel"}]}], "stocked_quantity": 706, "reserved_quantity": 0, "raw_stocked_quantity": {"value": "706", "precision": 20}, "raw_reserved_quantity": {"value": "0", "precision": 20}}], "requires_shipping": true}, "variant_id": "variant_01KHTKFYBZ5CC78V7V83N6PEYA", "inventory_item_id": "iitem_01KHTKFYCSC5JZKQ4Y9KV4CNMM", "required_quantity": 1}], "manage_inventory": true}, "metadata": {}, "quantity": 1, "subtitle": "1 Pack", "subtotal": 180, "raw_total": {"value": "180", "precision": 20}, "tax_lines": [], "tax_total": 0, "thumbnail": "http://localhost:9000/static/1771496164803-image-1771495992704.png", "created_at": "2026-02-21T11:56:02.533Z", "deleted_at": null, "product_id": "prod_01KHTKFY8VDC4G7YD60DP3RVC1", "unit_price": 180, "updated_at": "2026-02-21T11:56:02.533Z", "variant_id": "variant_01KHTKFYBZ5CC78V7V83N6PEYA", "adjustments": [], "is_giftcard": false, "variant_sku": "MULTI-ATTA-1", "product_type": null, "raw_subtotal": {"value": "180", "precision": 20}, "product_title": "Multigrain Atta", "raw_tax_total": {"value": "0", "precision": 20}, "variant_title": "1 Pack", "discount_total": 0, "original_total": 180, "product_handle": "multigrain-atta", "raw_unit_price": {"value": "180", "precision": 20}, "is_custom_price": false, "is_discountable": true, "product_type_id": null, "variant_barcode": null, "is_tax_inclusive": false, "product_subtitle": null, "discount_subtotal": 0, "original_subtotal": 180, "requires_shipping": true, "discount_tax_total": 0, "original_tax_total": 0, "product_collection": null, "raw_discount_total": {"value": "0", "precision": 20}, "raw_original_total": {"value": "180", "precision": 20}, "product_description": "Healthy Multigrain Atta", "compare_at_unit_price": null, "raw_discount_subtotal": {"value": "0", "precision": 20}, "raw_original_subtotal": {"value": "180", "precision": 20}, "variant_option_values": null, "raw_discount_tax_total": {"value": "0", "precision": 20}, "raw_original_tax_total": {"value": "0", "precision": 20}, "raw_compare_at_unit_price": null}], "total": 180, "locale": null, "region": {"id": "reg_01KHTKFY0KFEBQMJJMD734XVS0", "name": "India", "metadata": null, "created_at": "2026-02-19T09:25:28.221Z", "deleted_at": null, "updated_at": "2026-02-19T09:25:28.221Z", "currency_code": "inr", "automatic_taxes": true}, "customer": {"id": "cus_01KHTPY41MVZPW7MHG4WCR9SWP", "email": "chetan.novarsis@gmail.com", "phone": "7771824784", "metadata": {"wishlist": []}, "last_name": "tikkal", "created_at": "2026-02-19T10:25:38.869Z", "created_by": null, "deleted_at": null, "first_name": "chetandsdf", "updated_at": "2026-02-20T07:11:32.608Z", "has_account": true, "company_name": null}, "metadata": null, "subtotal": 180, "raw_total": {"value": "180", "precision": 20}, "region_id": "reg_01KHTKFY0KFEBQMJJMD734XVS0", "tax_total": 0, "created_at": "2026-02-21T11:56:02.175Z", "item_total": 180, "promotions": [], "updated_at": "2026-02-21T11:56:20.131Z", "customer_id": "cus_01KHTPY41MVZPW7MHG4WCR9SWP", "completed_at": null, "credit_lines": [], "raw_subtotal": {"value": "180", "precision": 20}, "currency_code": "inr", "item_subtotal": 180, "raw_tax_total": {"value": "0", "precision": 20}, "discount_total": 0, "item_tax_total": 0, "original_total": 180, "raw_item_total": {"value": "180", "precision": 20}, "shipping_total": 0, "billing_address": {"id": "caaddr_01KJ00XKS23X5M2Q6NPS0BEKR0", "city": "indore", "phone": "7771454788", "company": "", "metadata": null, "province": "mp", "address_1": "sdgsd", "address_2": "af", "last_name": "tikkal", "created_at": "2026-02-21T11:56:20.131Z", "deleted_at": null, "first_name": "chetan", "updated_at": "2026-02-21T11:56:20.131Z", "customer_id": null, "postal_code": "121212", "country_code": "in"}, "sales_channel_id": "sc_01KHTF8JGN9HZWVEK942B6AAGQ", "shipping_address": {"id": "caaddr_01KJ00XKS39F0ZGW7CH3CXSSWX", "city": "indore", "phone": "7771454788", "company": "", "metadata": null, "province": "mp", "address_1": "sdgsd", "address_2": "af", "last_name": "tikkal", "created_at": "2026-02-21T11:56:20.131Z", "deleted_at": null, "first_name": "chetan", "updated_at": "2026-02-21T11:56:20.131Z", "customer_id": null, "postal_code": "121212", "country_code": "in"}, "shipping_methods": [{"id": "casm_01KJ00XPS2C9PT00WYYPYZV86X", "data": {}, "name": "Standard Shipping", "total": 0, "amount": 0, "cart_id": "cart_01KJ00X27TJN0NCJBRFSTM050G", "metadata": null, "subtotal": 0, "raw_total": {"value": "0", "precision": 20}, "tax_lines": [], "tax_total": 0, "created_at": "2026-02-21T11:56:23.205Z", "deleted_at": null, "raw_amount": {"value": "0", "precision": 20}, "updated_at": "2026-02-21T11:56:23.205Z", "adjustments": [], "description": null, "raw_subtotal": {"value": "0", "precision": 20}, "raw_tax_total": {"value": "0", "precision": 20}, "discount_total": 0, "original_total": 0, "is_tax_inclusive": false, "discount_subtotal": 0, "original_subtotal": 0, "discount_tax_total": 0, "original_tax_total": 0, "raw_discount_total": {"value": "0", "precision": 20}, "raw_original_total": {"value": "0", "precision": 20}, "shipping_option_id": "so_01KHTKFY58XNN3M9WYSRN52W9P", "raw_discount_subtotal": {"value": "0", "precision": 20}, "raw_original_subtotal": {"value": "0", "precision": 20}, "raw_discount_tax_total": {"value": "0", "precision": 20}, "raw_original_tax_total": {"value": "0", "precision": 20}}], "raw_item_subtotal": {"value": "180", "precision": 20}, "shipping_subtotal": 0, "discount_tax_total": 0, "original_tax_total": 0, "payment_collection": {"id": "pay_col_01KJ00XTHEGSB1RBX6SA1HK8FT", "amount": 180, "status": "not_paid", "metadata": null, "created_at": "2026-02-21T11:56:27.054Z", "deleted_at": null, "raw_amount": {"value": "180", "precision": 20}, "updated_at": "2026-02-21T11:56:27.054Z", "completed_at": null, "currency_code": "inr", "captured_amount": null, "refunded_amount": null, "payment_sessions": [{"id": "payses_01KJ00XTNSDCBM2E5A0XC7S066", "data": {"id": "order_SImqtzEVcjcfFD", "notes": [], "amount": 18000, "entity": "order", "status": "created", "receipt": "order_1771674987200", "attempts": 0, "currency": "INR", "offer_id": null, "amount_due": 18000, "created_at": 1771674987, "amount_paid": 0}, "amount": 180, "status": "pending", "context": {"customer": {"id": "cus_01KHTPY41MVZPW7MHG4WCR9SWP", "email": "chetan.novarsis@gmail.com", "phone": "7771824784", "metadata": {"wishlist": []}, "addresses": [{"id": "cuaddr_01KHWZ9V2625ARTESDPHBP80E0", "city": "indore", "phone": "7771454788", "company": "", "metadata": null, "province": "mp", "address_1": "sdgsd", "address_2": "af", "last_name": "tikkal", "created_at": "2026-02-20T07:30:20.359Z", "deleted_at": null, "first_name": "chetan", "updated_at": "2026-02-20T07:30:20.359Z", "customer_id": "cus_01KHTPY41MVZPW7MHG4WCR9SWP", "postal_code": "121212", "address_name": null, "country_code": "in", "is_default_billing": false, "is_default_shipping": true}, {"id": "cuaddr_01KHWZAE472K4DCS9BP1XFN7BN", "city": "indore", "phone": "1234567891", "company": "ad", "metadata": null, "province": "mp", "address_1": "asd", "address_2": "", "last_name": "adsf", "created_at": "2026-02-20T07:30:39.880Z", "deleted_at": null, "first_name": "adfasd", "updated_at": "2026-02-20T07:30:39.880Z", "customer_id": "cus_01KHTPY41MVZPW7MHG4WCR9SWP", "postal_code": "123123", "address_name": null, "country_code": "in", "is_default_billing": false, "is_default_shipping": false}], "last_name": "tikkal", "first_name": "chetandsdf", "company_name": null, "account_holders": [], "billing_address": {"id": "cuaddr_01KHWZ9V2625ARTESDPHBP80E0", "city": "indore", "phone": "7771454788", "company": "", "metadata": null, "province": "mp", "address_1": "sdgsd", "address_2": "af", "last_name": "tikkal", "created_at": "2026-02-20T07:30:20.359Z", "deleted_at": null, "first_name": "chetan", "updated_at": "2026-02-20T07:30:20.359Z", "customer_id": "cus_01KHTPY41MVZPW7MHG4WCR9SWP", "postal_code": "121212", "address_name": null, "country_code": "in", "is_default_billing": false, "is_default_shipping": true}}}, "metadata": {}, "created_at": "2026-02-21T11:56:27.193Z", "deleted_at": null, "raw_amount": {"value": "180", "precision": 20}, "updated_at": "2026-02-21T11:56:27.386Z", "provider_id": "pp_razorpay_razorpay", "authorized_at": null, "currency_code": "inr", "payment_collection_id": "pay_col_01KJ00XTHEGSB1RBX6SA1HK8FT"}], "authorized_amount": null, "raw_captured_amount": null, "raw_refunded_amount": null, "raw_authorized_amount": null}, "raw_discount_total": {"value": "0", "precision": 20}, "raw_item_tax_total": {"value": "0", "precision": 20}, "raw_original_total": {"value": "180", "precision": 20}, "raw_shipping_total": {"value": "0", "precision": 20}, "shipping_tax_total": 0, "original_item_total": 180, "raw_shipping_subtotal": {"value": "0", "precision": 20}, "original_item_subtotal": 180, "raw_discount_tax_total": {"value": "0", "precision": 20}, "raw_original_tax_total": {"value": "0", "precision": 20}, "raw_shipping_tax_total": {"value": "0", "precision": 20}, "original_item_tax_total": 0, "original_shipping_total": 0, "raw_original_item_total": {"value": "180", "precision": 20}, "original_shipping_subtotal": 0, "raw_original_item_subtotal": {"value": "180", "precision": 20}, "original_shipping_tax_total": 0, "raw_original_item_tax_total": {"value": "0", "precision": 20}, "raw_original_shipping_total": {"value": "0", "precision": 20}, "raw_original_shipping_subtotal": {"value": "0", "precision": 20}, "raw_original_shipping_tax_total": {"value": "0", "precision": 20}}}, "compensateInput": {"data": {"id": "cart_01KJ00X27TJN0NCJBRFSTM050G", "email": "chetan.novarsis@gmail.com", "items": [{"id": "cali_01KJ00X2K4YD541FX5C4TENG5A", "title": "Multigrain Atta", "total": 180, "cart_id": "cart_01KJ00X27TJN0NCJBRFSTM050G", "variant": {"id": "variant_01KHTKFYBZ5CC78V7V83N6PEYA", "product": {"id": "prod_01KHTKFY8VDC4G7YD60DP3RVC1", "is_giftcard": false, "shipping_profile": {"id": "sp_01KHTF7PHNV7K4NX7KYCPW6WY1"}}, "product_id": "prod_01KHTKFY8VDC4G7YD60DP3RVC1", "allow_backorder": false, "inventory_items": [{"inventory": {"id": "iitem_01KHTKFYCSC5JZKQ4Y9KV4CNMM", "location_levels": [{"location_id": "sloc_01KHTKFY2C5P1JPMTTXXM6BQTB", "stock_locations": [{"id": "sloc_01KHTKFY2C5P1JPMTTXXM6BQTB", "name": "Main Warehouse", "sales_channels": [{"id": "sc_01KHTF8JGN9HZWVEK942B6AAGQ", "name": "Default Sales Channel"}]}], "stocked_quantity": 706, "reserved_quantity": 0, "raw_stocked_quantity": {"value": "706", "precision": 20}, "raw_reserved_quantity": {"value": "0", "precision": 20}}], "requires_shipping": true}, "variant_id": "variant_01KHTKFYBZ5CC78V7V83N6PEYA", "inventory_item_id": "iitem_01KHTKFYCSC5JZKQ4Y9KV4CNMM", "required_quantity": 1}], "manage_inventory": true}, "metadata": {}, "quantity": 1, "subtitle": "1 Pack", "subtotal": 180, "raw_total": {"value": "180", "precision": 20}, "tax_lines": [], "tax_total": 0, "thumbnail": "http://localhost:9000/static/1771496164803-image-1771495992704.png", "created_at": "2026-02-21T11:56:02.533Z", "deleted_at": null, "product_id": "prod_01KHTKFY8VDC4G7YD60DP3RVC1", "unit_price": 180, "updated_at": "2026-02-21T11:56:02.533Z", "variant_id": "variant_01KHTKFYBZ5CC78V7V83N6PEYA", "adjustments": [], "is_giftcard": false, "variant_sku": "MULTI-ATTA-1", "product_type": null, "raw_subtotal": {"value": "180", "precision": 20}, "product_title": "Multigrain Atta", "raw_tax_total": {"value": "0", "precision": 20}, "variant_title": "1 Pack", "discount_total": 0, "original_total": 180, "product_handle": "multigrain-atta", "raw_unit_price": {"value": "180", "precision": 20}, "is_custom_price": false, "is_discountable": true, "product_type_id": null, "variant_barcode": null, "is_tax_inclusive": false, "product_subtitle": null, "discount_subtotal": 0, "original_subtotal": 180, "requires_shipping": true, "discount_tax_total": 0, "original_tax_total": 0, "product_collection": null, "raw_discount_total": {"value": "0", "precision": 20}, "raw_original_total": {"value": "180", "precision": 20}, "product_description": "Healthy Multigrain Atta", "compare_at_unit_price": null, "raw_discount_subtotal": {"value": "0", "precision": 20}, "raw_original_subtotal": {"value": "180", "precision": 20}, "variant_option_values": null, "raw_discount_tax_total": {"value": "0", "precision": 20}, "raw_original_tax_total": {"value": "0", "precision": 20}, "raw_compare_at_unit_price": null}], "total": 180, "locale": null, "region": {"id": "reg_01KHTKFY0KFEBQMJJMD734XVS0", "name": "India", "metadata": null, "created_at": "2026-02-19T09:25:28.221Z", "deleted_at": null, "updated_at": "2026-02-19T09:25:28.221Z", "currency_code": "inr", "automatic_taxes": true}, "customer": {"id": "cus_01KHTPY41MVZPW7MHG4WCR9SWP", "email": "chetan.novarsis@gmail.com", "phone": "7771824784", "metadata": {"wishlist": []}, "last_name": "tikkal", "created_at": "2026-02-19T10:25:38.869Z", "created_by": null, "deleted_at": null, "first_name": "chetandsdf", "updated_at": "2026-02-20T07:11:32.608Z", "has_account": true, "company_name": null}, "metadata": null, "subtotal": 180, "raw_total": {"value": "180", "precision": 20}, "region_id": "reg_01KHTKFY0KFEBQMJJMD734XVS0", "tax_total": 0, "created_at": "2026-02-21T11:56:02.175Z", "item_total": 180, "promotions": [], "updated_at": "2026-02-21T11:56:20.131Z", "customer_id": "cus_01KHTPY41MVZPW7MHG4WCR9SWP", "completed_at": null, "credit_lines": [], "raw_subtotal": {"value": "180", "precision": 20}, "currency_code": "inr", "item_subtotal": 180, "raw_tax_total": {"value": "0", "precision": 20}, "discount_total": 0, "item_tax_total": 0, "original_total": 180, "raw_item_total": {"value": "180", "precision": 20}, "shipping_total": 0, "billing_address": {"id": "caaddr_01KJ00XKS23X5M2Q6NPS0BEKR0", "city": "indore", "phone": "7771454788", "company": "", "metadata": null, "province": "mp", "address_1": "sdgsd", "address_2": "af", "last_name": "tikkal", "created_at": "2026-02-21T11:56:20.131Z", "deleted_at": null, "first_name": "chetan", "updated_at": "2026-02-21T11:56:20.131Z", "customer_id": null, "postal_code": "121212", "country_code": "in"}, "sales_channel_id": "sc_01KHTF8JGN9HZWVEK942B6AAGQ", "shipping_address": {"id": "caaddr_01KJ00XKS39F0ZGW7CH3CXSSWX", "city": "indore", "phone": "7771454788", "company": "", "metadata": null, "province": "mp", "address_1": "sdgsd", "address_2": "af", "last_name": "tikkal", "created_at": "2026-02-21T11:56:20.131Z", "deleted_at": null, "first_name": "chetan", "updated_at": "2026-02-21T11:56:20.131Z", "customer_id": null, "postal_code": "121212", "country_code": "in"}, "shipping_methods": [{"id": "casm_01KJ00XPS2C9PT00WYYPYZV86X", "data": {}, "name": "Standard Shipping", "total": 0, "amount": 0, "cart_id": "cart_01KJ00X27TJN0NCJBRFSTM050G", "metadata": null, "subtotal": 0, "raw_total": {"value": "0", "precision": 20}, "tax_lines": [], "tax_total": 0, "created_at": "2026-02-21T11:56:23.205Z", "deleted_at": null, "raw_amount": {"value": "0", "precision": 20}, "updated_at": "2026-02-21T11:56:23.205Z", "adjustments": [], "description": null, "raw_subtotal": {"value": "0", "precision": 20}, "raw_tax_total": {"value": "0", "precision": 20}, "discount_total": 0, "original_total": 0, "is_tax_inclusive": false, "discount_subtotal": 0, "original_subtotal": 0, "discount_tax_total": 0, "original_tax_total": 0, "raw_discount_total": {"value": "0", "precision": 20}, "raw_original_total": {"value": "0", "precision": 20}, "shipping_option_id": "so_01KHTKFY58XNN3M9WYSRN52W9P", "raw_discount_subtotal": {"value": "0", "precision": 20}, "raw_original_subtotal": {"value": "0", "precision": 20}, "raw_discount_tax_total": {"value": "0", "precision": 20}, "raw_original_tax_total": {"value": "0", "precision": 20}}], "raw_item_subtotal": {"value": "180", "precision": 20}, "shipping_subtotal": 0, "discount_tax_total": 0, "original_tax_total": 0, "payment_collection": {"id": "pay_col_01KJ00XTHEGSB1RBX6SA1HK8FT", "amount": 180, "status": "not_paid", "metadata": null, "created_at": "2026-02-21T11:56:27.054Z", "deleted_at": null, "raw_amount": {"value": "180", "precision": 20}, "updated_at": "2026-02-21T11:56:27.054Z", "completed_at": null, "currency_code": "inr", "captured_amount": null, "refunded_amount": null, "payment_sessions": [{"id": "payses_01KJ00XTNSDCBM2E5A0XC7S066", "data": {"id": "order_SImqtzEVcjcfFD", "notes": [], "amount": 18000, "entity": "order", "status": "created", "receipt": "order_1771674987200", "attempts": 0, "currency": "INR", "offer_id": null, "amount_due": 18000, "created_at": 1771674987, "amount_paid": 0}, "amount": 180, "status": "pending", "context": {"customer": {"id": "cus_01KHTPY41MVZPW7MHG4WCR9SWP", "email": "chetan.novarsis@gmail.com", "phone": "7771824784", "metadata": {"wishlist": []}, "addresses": [{"id": "cuaddr_01KHWZ9V2625ARTESDPHBP80E0", "city": "indore", "phone": "7771454788", "company": "", "metadata": null, "province": "mp", "address_1": "sdgsd", "address_2": "af", "last_name": "tikkal", "created_at": "2026-02-20T07:30:20.359Z", "deleted_at": null, "first_name": "chetan", "updated_at": "2026-02-20T07:30:20.359Z", "customer_id": "cus_01KHTPY41MVZPW7MHG4WCR9SWP", "postal_code": "121212", "address_name": null, "country_code": "in", "is_default_billing": false, "is_default_shipping": true}, {"id": "cuaddr_01KHWZAE472K4DCS9BP1XFN7BN", "city": "indore", "phone": "1234567891", "company": "ad", "metadata": null, "province": "mp", "address_1": "asd", "address_2": "", "last_name": "adsf", "created_at": "2026-02-20T07:30:39.880Z", "deleted_at": null, "first_name": "adfasd", "updated_at": "2026-02-20T07:30:39.880Z", "customer_id": "cus_01KHTPY41MVZPW7MHG4WCR9SWP", "postal_code": "123123", "address_name": null, "country_code": "in", "is_default_billing": false, "is_default_shipping": false}], "last_name": "tikkal", "first_name": "chetandsdf", "company_name": null, "account_holders": [], "billing_address": {"id": "cuaddr_01KHWZ9V2625ARTESDPHBP80E0", "city": "indore", "phone": "7771454788", "company": "", "metadata": null, "province": "mp", "address_1": "sdgsd", "address_2": "af", "last_name": "tikkal", "created_at": "2026-02-20T07:30:20.359Z", "deleted_at": null, "first_name": "chetan", "updated_at": "2026-02-20T07:30:20.359Z", "customer_id": "cus_01KHTPY41MVZPW7MHG4WCR9SWP", "postal_code": "121212", "address_name": null, "country_code": "in", "is_default_billing": false, "is_default_shipping": true}}}, "metadata": {}, "created_at": "2026-02-21T11:56:27.193Z", "deleted_at": null, "raw_amount": {"value": "180", "precision": 20}, "updated_at": "2026-02-21T11:56:27.386Z", "provider_id": "pp_razorpay_razorpay", "authorized_at": null, "currency_code": "inr", "payment_collection_id": "pay_col_01KJ00XTHEGSB1RBX6SA1HK8FT"}], "authorized_amount": null, "raw_captured_amount": null, "raw_refunded_amount": null, "raw_authorized_amount": null}, "raw_discount_total": {"value": "0", "precision": 20}, "raw_item_tax_total": {"value": "0", "precision": 20}, "raw_original_total": {"value": "180", "precision": 20}, "raw_shipping_total": {"value": "0", "precision": 20}, "shipping_tax_total": 0, "original_item_total": 180, "raw_shipping_subtotal": {"value": "0", "precision": 20}, "original_item_subtotal": 180, "raw_discount_tax_total": {"value": "0", "precision": 20}, "raw_original_tax_total": {"value": "0", "precision": 20}, "raw_shipping_tax_total": {"value": "0", "precision": 20}, "original_item_tax_total": 0, "original_shipping_total": 0, "raw_original_item_total": {"value": "180", "precision": 20}, "original_shipping_subtotal": 0, "raw_original_item_subtotal": {"value": "180", "precision": 20}, "original_shipping_tax_total": 0, "raw_original_item_tax_total": {"value": "0", "precision": 20}, "raw_original_shipping_total": {"value": "0", "precision": 20}, "raw_original_shipping_subtotal": {"value": "0", "precision": 20}, "raw_original_shipping_tax_total": {"value": "0", "precision": 20}}}}}, "create-order": {"__type": "Symbol(WorkflowWorkflowData)", "output": {"__type": "Symbol(WorkflowStepResponse)", "output": {"id": "order_01KJ010SJHRQ62VG9NA9H3ZA55", "email": "chetan.novarsis@gmail.com", "items": [{"id": "ordli_01KJ010SJJ557WCHTFST6X7NMH", "title": "Multigrain Atta", "detail": {"id": "orditem_01KJ010SJJB153034TCSB7RZZH", "item_id": "ordli_01KJ010SJJ557WCHTFST6X7NMH", "version": 1, "metadata": null, "order_id": "order_01KJ010SJHRQ62VG9NA9H3ZA55", "quantity": 1, "created_at": "2026-02-21T11:58:04.372Z", "deleted_at": null, "unit_price": null, "updated_at": "2026-02-21T11:58:04.372Z", "raw_quantity": {"value": "1", "precision": 20}, "raw_unit_price": null, "shipped_quantity": 0, "delivered_quantity": 0, "fulfilled_quantity": 0, "raw_shipped_quantity": {"value": "0", "precision": 20}, "written_off_quantity": 0, "compare_at_unit_price": null, "raw_delivered_quantity": {"value": "0", "precision": 20}, "raw_fulfilled_quantity": {"value": "0", "precision": 20}, "raw_written_off_quantity": {"value": "0", "precision": 20}, "return_received_quantity": 0, "raw_compare_at_unit_price": null, "return_dismissed_quantity": 0, "return_requested_quantity": 0, "raw_return_received_quantity": {"value": "0", "precision": 20}, "raw_return_dismissed_quantity": {"value": "0", "precision": 20}, "raw_return_requested_quantity": {"value": "0", "precision": 20}}, "metadata": {}, "quantity": 1, "subtitle": "1 Pack", "tax_lines": [], "thumbnail": "http://localhost:9000/static/1771496164803-image-1771495992704.png", "created_at": "2026-02-21T11:58:04.372Z", "deleted_at": null, "product_id": "prod_01KHTKFY8VDC4G7YD60DP3RVC1", "unit_price": 180, "updated_at": "2026-02-21T11:58:04.372Z", "variant_id": "variant_01KHTKFYBZ5CC78V7V83N6PEYA", "adjustments": [], "is_giftcard": false, "variant_sku": "MULTI-ATTA-1", "product_type": null, "raw_quantity": {"value": "1", "precision": 20}, "product_title": "Multigrain Atta", "variant_title": "1 Pack", "product_handle": "multigrain-atta", "raw_unit_price": {"value": "180", "precision": 20}, "is_custom_price": false, "is_discountable": true, "product_type_id": null, "variant_barcode": null, "is_tax_inclusive": false, "product_subtitle": null, "requires_shipping": true, "product_collection": null, "product_description": "Healthy Multigrain Atta", "compare_at_unit_price": null, "variant_option_values": null, "raw_compare_at_unit_price": null}], "locale": null, "status": "pending", "summary": {"paid_total": 0, "raw_paid_total": {"value": "0", "precision": 20}, "refunded_total": 0, "accounting_total": 180, "credit_line_total": 0, "transaction_total": 0, "pending_difference": 180, "raw_refunded_total": {"value": "0", "precision": 20}, "current_order_total": 180, "original_order_total": 180, "raw_accounting_total": {"value": "180", "precision": 20}, "raw_credit_line_total": {"value": "0", "precision": 20}, "raw_transaction_total": {"value": "0", "precision": 20}, "raw_pending_difference": {"value": "180", "precision": 20}, "raw_current_order_total": {"value": "180", "precision": 20}, "raw_original_order_total": {"value": "180", "precision": 20}}, "version": 1, "metadata": null, "region_id": "reg_01KHTKFY0KFEBQMJJMD734XVS0", "created_at": "2026-02-21T11:58:04.371Z", "deleted_at": null, "display_id": 3, "updated_at": "2026-02-21T11:58:04.371Z", "canceled_at": null, "customer_id": "cus_01KHTPY41MVZPW7MHG4WCR9SWP", "credit_lines": [], "transactions": [], "currency_code": "inr", "is_draft_order": false, "billing_address": {"id": "ordaddr_01KJ010SJDS98SD9HFMQEXNERS", "city": "indore", "phone": "7771454788", "company": "", "metadata": null, "province": "mp", "address_1": "sdgsd", "address_2": "af", "last_name": "tikkal", "created_at": "2026-02-21T11:56:20.131Z", "deleted_at": null, "first_name": "chetan", "updated_at": "2026-02-21T11:56:20.131Z", "customer_id": null, "postal_code": "121212", "country_code": "in"}, "no_notification": false, "sales_channel_id": "sc_01KHTF8JGN9HZWVEK942B6AAGQ", "shipping_address": {"id": "ordaddr_01KJ010SJD96KM1F53WFPSFP8W", "city": "indore", "phone": "7771454788", "company": "", "metadata": null, "province": "mp", "address_1": "sdgsd", "address_2": "af", "last_name": "tikkal", "created_at": "2026-02-21T11:56:20.131Z", "deleted_at": null, "first_name": "chetan", "updated_at": "2026-02-21T11:56:20.131Z", "customer_id": null, "postal_code": "121212", "country_code": "in"}, "shipping_methods": [{"id": "ordsm_01KJ010SJHHKC2QDFH99GZXBZ6", "data": {}, "name": "Standard Shipping", "amount": 0, "detail": {"id": "ordspmv_01KJ010SJHW2DJ53FS9J35ZNY6", "version": 1, "claim_id": null, "order_id": "order_01KJ010SJHRQ62VG9NA9H3ZA55", "return_id": null, "created_at": "2026-02-21T11:58:04.373Z", "deleted_at": null, "updated_at": "2026-02-21T11:58:04.373Z", "exchange_id": null, "shipping_method_id": "ordsm_01KJ010SJHHKC2QDFH99GZXBZ6"}, "metadata": null, "order_id": "order_01KJ010SJHRQ62VG9NA9H3ZA55", "tax_lines": [], "created_at": "2026-02-21T11:58:04.372Z", "deleted_at": null, "raw_amount": {"value": "0", "precision": 20}, "updated_at": "2026-02-21T11:58:04.372Z", "adjustments": [], "description": null, "is_custom_amount": false, "is_tax_inclusive": false, "shipping_option_id": "so_01KHTKFY58XNN3M9WYSRN52W9P"}], "custom_display_id": null, "billing_address_id": "ordaddr_01KJ010SJDS98SD9HFMQEXNERS", "shipping_address_id": "ordaddr_01KJ010SJD96KM1F53WFPSFP8W"}, "compensateInput": {"id": "order_01KJ010SJHRQ62VG9NA9H3ZA55", "email": "chetan.novarsis@gmail.com", "items": [{"id": "ordli_01KJ010SJJ557WCHTFST6X7NMH", "title": "Multigrain Atta", "detail": {"id": "orditem_01KJ010SJJB153034TCSB7RZZH", "item_id": "ordli_01KJ010SJJ557WCHTFST6X7NMH", "version": 1, "metadata": null, "order_id": "order_01KJ010SJHRQ62VG9NA9H3ZA55", "quantity": 1, "created_at": "2026-02-21T11:58:04.372Z", "deleted_at": null, "unit_price": null, "updated_at": "2026-02-21T11:58:04.372Z", "raw_quantity": {"value": "1", "precision": 20}, "raw_unit_price": null, "shipped_quantity": 0, "delivered_quantity": 0, "fulfilled_quantity": 0, "raw_shipped_quantity": {"value": "0", "precision": 20}, "written_off_quantity": 0, "compare_at_unit_price": null, "raw_delivered_quantity": {"value": "0", "precision": 20}, "raw_fulfilled_quantity": {"value": "0", "precision": 20}, "raw_written_off_quantity": {"value": "0", "precision": 20}, "return_received_quantity": 0, "raw_compare_at_unit_price": null, "return_dismissed_quantity": 0, "return_requested_quantity": 0, "raw_return_received_quantity": {"value": "0", "precision": 20}, "raw_return_dismissed_quantity": {"value": "0", "precision": 20}, "raw_return_requested_quantity": {"value": "0", "precision": 20}}, "metadata": {}, "quantity": 1, "subtitle": "1 Pack", "tax_lines": [], "thumbnail": "http://localhost:9000/static/1771496164803-image-1771495992704.png", "created_at": "2026-02-21T11:58:04.372Z", "deleted_at": null, "product_id": "prod_01KHTKFY8VDC4G7YD60DP3RVC1", "unit_price": 180, "updated_at": "2026-02-21T11:58:04.372Z", "variant_id": "variant_01KHTKFYBZ5CC78V7V83N6PEYA", "adjustments": [], "is_giftcard": false, "variant_sku": "MULTI-ATTA-1", "product_type": null, "raw_quantity": {"value": "1", "precision": 20}, "product_title": "Multigrain Atta", "variant_title": "1 Pack", "product_handle": "multigrain-atta", "raw_unit_price": {"value": "180", "precision": 20}, "is_custom_price": false, "is_discountable": true, "product_type_id": null, "variant_barcode": null, "is_tax_inclusive": false, "product_subtitle": null, "requires_shipping": true, "product_collection": null, "product_description": "Healthy Multigrain Atta", "compare_at_unit_price": null, "variant_option_values": null, "raw_compare_at_unit_price": null}], "locale": null, "status": "pending", "summary": {"paid_total": 0, "raw_paid_total": {"value": "0", "precision": 20}, "refunded_total": 0, "accounting_total": 180, "credit_line_total": 0, "transaction_total": 0, "pending_difference": 180, "raw_refunded_total": {"value": "0", "precision": 20}, "current_order_total": 180, "original_order_total": 180, "raw_accounting_total": {"value": "180", "precision": 20}, "raw_credit_line_total": {"value": "0", "precision": 20}, "raw_transaction_total": {"value": "0", "precision": 20}, "raw_pending_difference": {"value": "180", "precision": 20}, "raw_current_order_total": {"value": "180", "precision": 20}, "raw_original_order_total": {"value": "180", "precision": 20}}, "version": 1, "metadata": null, "region_id": "reg_01KHTKFY0KFEBQMJJMD734XVS0", "created_at": "2026-02-21T11:58:04.371Z", "deleted_at": null, "display_id": 3, "updated_at": "2026-02-21T11:58:04.371Z", "canceled_at": null, "customer_id": "cus_01KHTPY41MVZPW7MHG4WCR9SWP", "credit_lines": [], "transactions": [], "currency_code": "inr", "is_draft_order": false, "billing_address": {"id": "ordaddr_01KJ010SJDS98SD9HFMQEXNERS", "city": "indore", "phone": "7771454788", "company": "", "metadata": null, "province": "mp", "address_1": "sdgsd", "address_2": "af", "last_name": "tikkal", "created_at": "2026-02-21T11:56:20.131Z", "deleted_at": null, "first_name": "chetan", "updated_at": "2026-02-21T11:56:20.131Z", "customer_id": null, "postal_code": "121212", "country_code": "in"}, "no_notification": false, "sales_channel_id": "sc_01KHTF8JGN9HZWVEK942B6AAGQ", "shipping_address": {"id": "ordaddr_01KJ010SJD96KM1F53WFPSFP8W", "city": "indore", "phone": "7771454788", "company": "", "metadata": null, "province": "mp", "address_1": "sdgsd", "address_2": "af", "last_name": "tikkal", "created_at": "2026-02-21T11:56:20.131Z", "deleted_at": null, "first_name": "chetan", "updated_at": "2026-02-21T11:56:20.131Z", "customer_id": null, "postal_code": "121212", "country_code": "in"}, "shipping_methods": [{"id": "ordsm_01KJ010SJHHKC2QDFH99GZXBZ6", "data": {}, "name": "Standard Shipping", "amount": 0, "detail": {"id": "ordspmv_01KJ010SJHW2DJ53FS9J35ZNY6", "version": 1, "claim_id": null, "order_id": "order_01KJ010SJHRQ62VG9NA9H3ZA55", "return_id": null, "created_at": "2026-02-21T11:58:04.373Z", "deleted_at": null, "updated_at": "2026-02-21T11:58:04.373Z", "exchange_id": null, "shipping_method_id": "ordsm_01KJ010SJHHKC2QDFH99GZXBZ6"}, "metadata": null, "order_id": "order_01KJ010SJHRQ62VG9NA9H3ZA55", "tax_lines": [], "created_at": "2026-02-21T11:58:04.372Z", "deleted_at": null, "raw_amount": {"value": "0", "precision": 20}, "updated_at": "2026-02-21T11:58:04.372Z", "adjustments": [], "description": null, "is_custom_amount": false, "is_tax_inclusive": false, "shipping_option_id": "so_01KHTKFY58XNN3M9WYSRN52W9P"}], "custom_display_id": null, "billing_address_id": "ordaddr_01KJ010SJDS98SD9HFMQEXNERS", "shipping_address_id": "ordaddr_01KJ010SJD96KM1F53WFPSFP8W"}}}, "orderCreated": {"__type": "Symbol(WorkflowWorkflowData)", "output": {"__type": "Symbol(WorkflowStepResponse)"}}, "update-carts": {"__type": "Symbol(WorkflowWorkflowData)", "output": {"__type": "Symbol(WorkflowStepResponse)", "output": [{"id": "cart_01KJ00X27TJN0NCJBRFSTM050G", "email": "chetan.novarsis@gmail.com", "locale": null, "metadata": null, "region_id": "reg_01KHTKFY0KFEBQMJJMD734XVS0", "created_at": "2026-02-21T11:56:02.175Z", "deleted_at": null, "updated_at": "2026-02-21T11:58:04.499Z", "customer_id": "cus_01KHTPY41MVZPW7MHG4WCR9SWP", "completed_at": "2026-02-21T11:58:04.458Z", "currency_code": "inr", "billing_address": {"id": "caaddr_01KJ00XKS23X5M2Q6NPS0BEKR0"}, "sales_channel_id": "sc_01KHTF8JGN9HZWVEK942B6AAGQ", "shipping_address": {"id": "caaddr_01KJ00XKS39F0ZGW7CH3CXSSWX"}, "billing_address_id": "caaddr_01KJ00XKS23X5M2Q6NPS0BEKR0", "shipping_address_id": "caaddr_01KJ00XKS39F0ZGW7CH3CXSSWX"}], "compensateInput": {"cartsBeforeUpdate": [{"id": "cart_01KJ00X27TJN0NCJBRFSTM050G", "email": "chetan.novarsis@gmail.com", "metadata": null, "region_id": "reg_01KHTKFY0KFEBQMJJMD734XVS0", "customer_id": "cus_01KHTPY41MVZPW7MHG4WCR9SWP", "completed_at": null, "currency_code": "inr", "sales_channel_id": "sc_01KHTF8JGN9HZWVEK942B6AAGQ"}], "addressesBeforeUpdate": []}}}, "create-orders": {"__type": "Symbol(WorkflowWorkflowData)", "output": {"__type": "Symbol(WorkflowStepResponse)", "output": [{"id": "order_01KJ010SJHRQ62VG9NA9H3ZA55", "email": "chetan.novarsis@gmail.com", "items": [{"id": "ordli_01KJ010SJJ557WCHTFST6X7NMH", "title": "Multigrain Atta", "detail": {"id": "orditem_01KJ010SJJB153034TCSB7RZZH", "item_id": "ordli_01KJ010SJJ557WCHTFST6X7NMH", "version": 1, "metadata": null, "order_id": "order_01KJ010SJHRQ62VG9NA9H3ZA55", "quantity": 1, "created_at": "2026-02-21T11:58:04.372Z", "deleted_at": null, "unit_price": null, "updated_at": "2026-02-21T11:58:04.372Z", "raw_quantity": {"value": "1", "precision": 20}, "raw_unit_price": null, "shipped_quantity": 0, "delivered_quantity": 0, "fulfilled_quantity": 0, "raw_shipped_quantity": {"value": "0", "precision": 20}, "written_off_quantity": 0, "compare_at_unit_price": null, "raw_delivered_quantity": {"value": "0", "precision": 20}, "raw_fulfilled_quantity": {"value": "0", "precision": 20}, "raw_written_off_quantity": {"value": "0", "precision": 20}, "return_received_quantity": 0, "raw_compare_at_unit_price": null, "return_dismissed_quantity": 0, "return_requested_quantity": 0, "raw_return_received_quantity": {"value": "0", "precision": 20}, "raw_return_dismissed_quantity": {"value": "0", "precision": 20}, "raw_return_requested_quantity": {"value": "0", "precision": 20}}, "metadata": {}, "quantity": 1, "subtitle": "1 Pack", "tax_lines": [], "thumbnail": "http://localhost:9000/static/1771496164803-image-1771495992704.png", "created_at": "2026-02-21T11:58:04.372Z", "deleted_at": null, "product_id": "prod_01KHTKFY8VDC4G7YD60DP3RVC1", "unit_price": 180, "updated_at": "2026-02-21T11:58:04.372Z", "variant_id": "variant_01KHTKFYBZ5CC78V7V83N6PEYA", "adjustments": [], "is_giftcard": false, "variant_sku": "MULTI-ATTA-1", "product_type": null, "raw_quantity": {"value": "1", "precision": 20}, "product_title": "Multigrain Atta", "variant_title": "1 Pack", "product_handle": "multigrain-atta", "raw_unit_price": {"value": "180", "precision": 20}, "is_custom_price": false, "is_discountable": true, "product_type_id": null, "variant_barcode": null, "is_tax_inclusive": false, "product_subtitle": null, "requires_shipping": true, "product_collection": null, "product_description": "Healthy Multigrain Atta", "compare_at_unit_price": null, "variant_option_values": null, "raw_compare_at_unit_price": null}], "locale": null, "status": "pending", "summary": {"paid_total": 0, "raw_paid_total": {"value": "0", "precision": 20}, "refunded_total": 0, "accounting_total": 180, "credit_line_total": 0, "transaction_total": 0, "pending_difference": 180, "raw_refunded_total": {"value": "0", "precision": 20}, "current_order_total": 180, "original_order_total": 180, "raw_accounting_total": {"value": "180", "precision": 20}, "raw_credit_line_total": {"value": "0", "precision": 20}, "raw_transaction_total": {"value": "0", "precision": 20}, "raw_pending_difference": {"value": "180", "precision": 20}, "raw_current_order_total": {"value": "180", "precision": 20}, "raw_original_order_total": {"value": "180", "precision": 20}}, "version": 1, "metadata": null, "region_id": "reg_01KHTKFY0KFEBQMJJMD734XVS0", "created_at": "2026-02-21T11:58:04.371Z", "deleted_at": null, "display_id": 3, "updated_at": "2026-02-21T11:58:04.371Z", "canceled_at": null, "customer_id": "cus_01KHTPY41MVZPW7MHG4WCR9SWP", "credit_lines": [], "transactions": [], "currency_code": "inr", "is_draft_order": false, "billing_address": {"id": "ordaddr_01KJ010SJDS98SD9HFMQEXNERS", "city": "indore", "phone": "7771454788", "company": "", "metadata": null, "province": "mp", "address_1": "sdgsd", "address_2": "af", "last_name": "tikkal", "created_at": "2026-02-21T11:56:20.131Z", "deleted_at": null, "first_name": "chetan", "updated_at": "2026-02-21T11:56:20.131Z", "customer_id": null, "postal_code": "121212", "country_code": "in"}, "no_notification": false, "sales_channel_id": "sc_01KHTF8JGN9HZWVEK942B6AAGQ", "shipping_address": {"id": "ordaddr_01KJ010SJD96KM1F53WFPSFP8W", "city": "indore", "phone": "7771454788", "company": "", "metadata": null, "province": "mp", "address_1": "sdgsd", "address_2": "af", "last_name": "tikkal", "created_at": "2026-02-21T11:56:20.131Z", "deleted_at": null, "first_name": "chetan", "updated_at": "2026-02-21T11:56:20.131Z", "customer_id": null, "postal_code": "121212", "country_code": "in"}, "shipping_methods": [{"id": "ordsm_01KJ010SJHHKC2QDFH99GZXBZ6", "data": {}, "name": "Standard Shipping", "amount": 0, "detail": {"id": "ordspmv_01KJ010SJHW2DJ53FS9J35ZNY6", "version": 1, "claim_id": null, "order_id": "order_01KJ010SJHRQ62VG9NA9H3ZA55", "return_id": null, "created_at": "2026-02-21T11:58:04.373Z", "deleted_at": null, "updated_at": "2026-02-21T11:58:04.373Z", "exchange_id": null, "shipping_method_id": "ordsm_01KJ010SJHHKC2QDFH99GZXBZ6"}, "metadata": null, "order_id": "order_01KJ010SJHRQ62VG9NA9H3ZA55", "tax_lines": [], "created_at": "2026-02-21T11:58:04.372Z", "deleted_at": null, "raw_amount": {"value": "0", "precision": 20}, "updated_at": "2026-02-21T11:58:04.372Z", "adjustments": [], "description": null, "is_custom_amount": false, "is_tax_inclusive": false, "shipping_option_id": "so_01KHTKFY58XNN3M9WYSRN52W9P"}], "custom_display_id": null, "billing_address_id": "ordaddr_01KJ010SJDS98SD9HFMQEXNERS", "shipping_address_id": "ordaddr_01KJ010SJD96KM1F53WFPSFP8W"}], "compensateInput": ["order_01KJ010SJHRQ62VG9NA9H3ZA55"]}}, "register-usage": {"__type": "Symbol(WorkflowWorkflowData)", "output": {"__type": "Symbol(WorkflowStepResponse)", "output": null, "compensateInput": {"computedActions": [], "registrationContext": {"customer_id": "cus_01KHTPY41MVZPW7MHG4WCR9SWP", "customer_email": "chetan.novarsis@gmail.com"}}}}, "emit-event-step": {"__type": "Symbol(WorkflowWorkflowData)", "output": {"__type": "Symbol(WorkflowStepResponse)", "output": {"eventName": "order.placed", "eventGroupId": "01KJ010SDXQ2P6GN1R01DQ8SE8"}, "compensateInput": {"eventName": "order.placed", "eventGroupId": "01KJ010SDXQ2P6GN1R01DQ8SE8"}}}, "acquire-lock-step": {"__type": "Symbol(WorkflowWorkflowData)", "output": {"__type": "Symbol(WorkflowStepResponse)", "compensateInput": {"keys": ["cart_01KJ00X27TJN0NCJBRFSTM050G"]}}}, "release-lock-step": {"__type": "Symbol(WorkflowWorkflowData)", "output": {"__type": "Symbol(WorkflowStepResponse)", "output": true, "compensateInput": true}}, "validate-shipping": {"__type": "Symbol(WorkflowWorkflowData)", "output": {"__type": "Symbol(WorkflowStepResponse)"}}, "create-remote-links": {"__type": "Symbol(WorkflowWorkflowData)", "output": {"__type": "Symbol(WorkflowStepResponse)", "output": [{"cart": {"cart_id": "cart_01KJ00X27TJN0NCJBRFSTM050G"}, "order": {"order_id": "order_01KJ010SJHRQ62VG9NA9H3ZA55"}}, {"order": {"order_id": "order_01KJ010SJHRQ62VG9NA9H3ZA55"}, "payment": {"payment_collection_id": "pay_col_01KJ00XTHEGSB1RBX6SA1HK8FT"}}], "compensateInput": [{"cart": {"cart_id": "cart_01KJ00X27TJN0NCJBRFSTM050G"}, "order": {"order_id": "order_01KJ010SJHRQ62VG9NA9H3ZA55"}}, {"order": {"order_id": "order_01KJ010SJHRQ62VG9NA9H3ZA55"}, "payment": {"payment_collection_id": "pay_col_01KJ00XTHEGSB1RBX6SA1HK8FT"}}]}}, "use-query-graph-step": {"__type": "Symbol(WorkflowWorkflowData)", "output": {"__type": "Symbol(WorkflowStepResponse)", "output": {}, "compensateInput": {}}}, "add-order-transaction": {"__type": "Symbol(WorkflowWorkflowData)", "output": {"__type": "Symbol(WorkflowStepResponse)", "output": [{"id": "ordtrx_01KJ010TNQ8RYT833XHC0NTB99", "amount": 180, "version": 1, "order_id": "order_01KJ010SJHRQ62VG9NA9H3ZA55", "reference": "capture", "created_at": "2026-02-21T11:58:05.505Z", "deleted_at": null, "raw_amount": {"value": "180", "precision": 20}, "updated_at": "2026-02-21T11:58:05.505Z", "reference_id": "capt_01KJ010TKVEWXEC3NMXV1JGEKJ", "currency_code": "inr"}], "compensateInput": ["ordtrx_01KJ010TNQ8RYT833XHC0NTB99"]}}, "reserve-inventory-step": {"__type": "Symbol(WorkflowWorkflowData)", "output": {"__type": "Symbol(WorkflowStepResponse)", "output": [{"id": "resitem_01KJ010SP9Y7MQBT225VP0TG9J", "metadata": null, "quantity": 1, "created_at": "2026-02-21T11:58:04.502Z", "created_by": null, "deleted_at": null, "updated_at": "2026-02-21T11:58:04.502Z", "description": null, "external_id": null, "location_id": "sloc_01KHTKFY2C5P1JPMTTXXM6BQTB", "line_item_id": "ordli_01KJ010SJJ557WCHTFST6X7NMH", "raw_quantity": {"value": "1", "precision": 20}, "allow_backorder": false, "inventory_item_id": "iitem_01KHTKFYCSC5JZKQ4Y9KV4CNMM"}], "compensateInput": {"reservations": ["resitem_01KJ010SP9Y7MQBT225VP0TG9J"], "inventoryItemIds": ["iitem_01KHTKFYCSC5JZKQ4Y9KV4CNMM"]}}}, "shipping-options-query": {"__type": "Symbol(WorkflowWorkflowData)", "output": {"__type": "Symbol(WorkflowStepResponse)", "output": {"data": [{"id": "so_01KHTKFY58XNN3M9WYSRN52W9P", "shipping_profile_id": "sp_01KHTF7PHNV7K4NX7KYCPW6WY1"}]}, "compensateInput": {"data": [{"id": "so_01KHTKFY58XNN3M9WYSRN52W9P", "shipping_profile_id": "sp_01KHTF7PHNV7K4NX7KYCPW6WY1"}]}}}, "validate-cart-payments": {"__type": "Symbol(WorkflowWorkflowData)", "output": {"__type": "Symbol(WorkflowStepResponse)", "output": [{"id": "payses_01KJ00XTNSDCBM2E5A0XC7S066", "data": {"id": "order_SImqtzEVcjcfFD", "notes": [], "amount": 18000, "entity": "order", "status": "created", "receipt": "order_1771674987200", "attempts": 0, "currency": "INR", "offer_id": null, "amount_due": 18000, "created_at": 1771674987, "amount_paid": 0}, "amount": 180, "status": "pending", "context": {"customer": {"id": "cus_01KHTPY41MVZPW7MHG4WCR9SWP", "email": "chetan.novarsis@gmail.com", "phone": "7771824784", "metadata": {"wishlist": []}, "addresses": [{"id": "cuaddr_01KHWZ9V2625ARTESDPHBP80E0", "city": "indore", "phone": "7771454788", "company": "", "metadata": null, "province": "mp", "address_1": "sdgsd", "address_2": "af", "last_name": "tikkal", "created_at": "2026-02-20T07:30:20.359Z", "deleted_at": null, "first_name": "chetan", "updated_at": "2026-02-20T07:30:20.359Z", "customer_id": "cus_01KHTPY41MVZPW7MHG4WCR9SWP", "postal_code": "121212", "address_name": null, "country_code": "in", "is_default_billing": false, "is_default_shipping": true}, {"id": "cuaddr_01KHWZAE472K4DCS9BP1XFN7BN", "city": "indore", "phone": "1234567891", "company": "ad", "metadata": null, "province": "mp", "address_1": "asd", "address_2": "", "last_name": "adsf", "created_at": "2026-02-20T07:30:39.880Z", "deleted_at": null, "first_name": "adfasd", "updated_at": "2026-02-20T07:30:39.880Z", "customer_id": "cus_01KHTPY41MVZPW7MHG4WCR9SWP", "postal_code": "123123", "address_name": null, "country_code": "in", "is_default_billing": false, "is_default_shipping": false}], "last_name": "tikkal", "first_name": "chetandsdf", "company_name": null, "account_holders": [], "billing_address": {"id": "cuaddr_01KHWZ9V2625ARTESDPHBP80E0", "city": "indore", "phone": "7771454788", "company": "", "metadata": null, "province": "mp", "address_1": "sdgsd", "address_2": "af", "last_name": "tikkal", "created_at": "2026-02-20T07:30:20.359Z", "deleted_at": null, "first_name": "chetan", "updated_at": "2026-02-20T07:30:20.359Z", "customer_id": "cus_01KHTPY41MVZPW7MHG4WCR9SWP", "postal_code": "121212", "address_name": null, "country_code": "in", "is_default_billing": false, "is_default_shipping": true}}}, "metadata": {}, "created_at": "2026-02-21T11:56:27.193Z", "deleted_at": null, "raw_amount": {"value": "180", "precision": 20}, "updated_at": "2026-02-21T11:56:27.386Z", "provider_id": "pp_razorpay_razorpay", "authorized_at": null, "currency_code": "inr", "payment_collection_id": "pay_col_01KJ00XTHEGSB1RBX6SA1HK8FT"}], "compensateInput": [{"id": "payses_01KJ00XTNSDCBM2E5A0XC7S066", "data": {"id": "order_SImqtzEVcjcfFD", "notes": [], "amount": 18000, "entity": "order", "status": "created", "receipt": "order_1771674987200", "attempts": 0, "currency": "INR", "offer_id": null, "amount_due": 18000, "created_at": 1771674987, "amount_paid": 0}, "amount": 180, "status": "pending", "context": {"customer": {"id": "cus_01KHTPY41MVZPW7MHG4WCR9SWP", "email": "chetan.novarsis@gmail.com", "phone": "7771824784", "metadata": {"wishlist": []}, "addresses": [{"id": "cuaddr_01KHWZ9V2625ARTESDPHBP80E0", "city": "indore", "phone": "7771454788", "company": "", "metadata": null, "province": "mp", "address_1": "sdgsd", "address_2": "af", "last_name": "tikkal", "created_at": "2026-02-20T07:30:20.359Z", "deleted_at": null, "first_name": "chetan", "updated_at": "2026-02-20T07:30:20.359Z", "customer_id": "cus_01KHTPY41MVZPW7MHG4WCR9SWP", "postal_code": "121212", "address_name": null, "country_code": "in", "is_default_billing": false, "is_default_shipping": true}, {"id": "cuaddr_01KHWZAE472K4DCS9BP1XFN7BN", "city": "indore", "phone": "1234567891", "company": "ad", "metadata": null, "province": "mp", "address_1": "asd", "address_2": "", "last_name": "adsf", "created_at": "2026-02-20T07:30:39.880Z", "deleted_at": null, "first_name": "adfasd", "updated_at": "2026-02-20T07:30:39.880Z", "customer_id": "cus_01KHTPY41MVZPW7MHG4WCR9SWP", "postal_code": "123123", "address_name": null, "country_code": "in", "is_default_billing": false, "is_default_shipping": false}], "last_name": "tikkal", "first_name": "chetandsdf", "company_name": null, "account_holders": [], "billing_address": {"id": "cuaddr_01KHWZ9V2625ARTESDPHBP80E0", "city": "indore", "phone": "7771454788", "company": "", "metadata": null, "province": "mp", "address_1": "sdgsd", "address_2": "af", "last_name": "tikkal", "created_at": "2026-02-20T07:30:20.359Z", "deleted_at": null, "first_name": "chetan", "updated_at": "2026-02-20T07:30:20.359Z", "customer_id": "cus_01KHTPY41MVZPW7MHG4WCR9SWP", "postal_code": "121212", "address_name": null, "country_code": "in", "is_default_billing": false, "is_default_shipping": true}}}, "metadata": {}, "created_at": "2026-02-21T11:56:27.193Z", "deleted_at": null, "raw_amount": {"value": "180", "precision": 20}, "updated_at": "2026-02-21T11:56:27.386Z", "provider_id": "pp_razorpay_razorpay", "authorized_at": null, "currency_code": "inr", "payment_collection_id": "pay_col_01KJ00XTHEGSB1RBX6SA1HK8FT"}]}}, "beforePaymentAuthorization": {"__type": "Symbol(WorkflowWorkflowData)", "output": {"__type": "Symbol(WorkflowStepResponse)"}}, "compensate-payment-if-needed": {"__type": "Symbol(WorkflowWorkflowData)", "output": {"__type": "Symbol(WorkflowStepResponse)", "output": "payses_01KJ00XTNSDCBM2E5A0XC7S066", "compensateInput": "payses_01KJ00XTNSDCBM2E5A0XC7S066"}}, "authorize-payment-session-step": {"__type": "Symbol(WorkflowWorkflowData)", "output": {"__type": "Symbol(WorkflowStepResponse)", "output": {"id": "pay_01KJ010TK7H1ZKCJGVEBTG5DDZ", "data": {"id": "pay_SImsFwMFl9fDEE", "fee": 424, "tax": 64, "upi": {"vpa": "asdf@okaxis", "flow": "collect"}, "vpa": "asdf@okaxis", "bank": null, "email": "chetan.novarsis@gmail.com", "notes": {"address": "sdgsd"}, "amount": 18000, "entity": "payment", "method": "upi", "status": "captured", "wallet": null, "card_id": null, "contact": "+917771454788", "receipt": "order_1771674987200", "attempts": 0, "captured": true, "currency": "INR", "offer_id": null, "order_id": "order_SImqtzEVcjcfFD", "amount_due": 18000, "created_at": 1771675064, "error_code": null, "error_step": null, "invoice_id": null, "amount_paid": 0, "description": "Order Payment", "error_reason": null, "error_source": null, "acquirer_data": {"rrn": "805442817767", "upi_transaction_id": "2C8704DED63B0062987A64CD29DB73CB"}, "international": false, "refund_status": null, "amount_refunded": 0, "error_description": null, "razorpay_payment_id": "pay_SImsFwMFl9fDEE", "razorpay_payment_status": "captured", "razorpay_payment_captured": true}, "amount": 180, "captures": [{"id": "capt_01KJ010TKVEWXEC3NMXV1JGEKJ", "amount": 180, "metadata": null, "created_at": "2026-02-21T11:58:05.453Z", "created_by": null, "deleted_at": null, "payment_id": "pay_01KJ010TK7H1ZKCJGVEBTG5DDZ", "raw_amount": {"value": "180", "precision": 20}, "updated_at": "2026-02-21T11:58:05.453Z"}], "metadata": null, "created_at": "2026-02-21T11:58:05.415Z", "deleted_at": null, "raw_amount": {"value": "180", "precision": 20}, "updated_at": "2026-02-21T11:58:05.454Z", "canceled_at": null, "captured_at": "2026-02-21T11:58:05.436Z", "provider_id": "pp_razorpay_razorpay", "currency_code": "inr", "payment_collection": {"id": "pay_col_01KJ00XTHEGSB1RBX6SA1HK8FT"}, "payment_session_id": "payses_01KJ00XTNSDCBM2E5A0XC7S066", "payment_collection_id": "pay_col_01KJ00XTHEGSB1RBX6SA1HK8FT"}, "compensateInput": {"id": "pay_01KJ010TK7H1ZKCJGVEBTG5DDZ", "data": {"id": "pay_SImsFwMFl9fDEE", "fee": 424, "tax": 64, "upi": {"vpa": "asdf@okaxis", "flow": "collect"}, "vpa": "asdf@okaxis", "bank": null, "email": "chetan.novarsis@gmail.com", "notes": {"address": "sdgsd"}, "amount": 18000, "entity": "payment", "method": "upi", "status": "captured", "wallet": null, "card_id": null, "contact": "+917771454788", "receipt": "order_1771674987200", "attempts": 0, "captured": true, "currency": "INR", "offer_id": null, "order_id": "order_SImqtzEVcjcfFD", "amount_due": 18000, "created_at": 1771675064, "error_code": null, "error_step": null, "invoice_id": null, "amount_paid": 0, "description": "Order Payment", "error_reason": null, "error_source": null, "acquirer_data": {"rrn": "805442817767", "upi_transaction_id": "2C8704DED63B0062987A64CD29DB73CB"}, "international": false, "refund_status": null, "amount_refunded": 0, "error_description": null, "razorpay_payment_id": "pay_SImsFwMFl9fDEE", "razorpay_payment_status": "captured", "razorpay_payment_captured": true}, "amount": 180, "captures": [{"id": "capt_01KJ010TKVEWXEC3NMXV1JGEKJ", "amount": 180, "metadata": null, "created_at": "2026-02-21T11:58:05.453Z", "created_by": null, "deleted_at": null, "payment_id": "pay_01KJ010TK7H1ZKCJGVEBTG5DDZ", "raw_amount": {"value": "180", "precision": 20}, "updated_at": "2026-02-21T11:58:05.453Z"}], "metadata": null, "created_at": "2026-02-21T11:58:05.415Z", "deleted_at": null, "raw_amount": {"value": "180", "precision": 20}, "updated_at": "2026-02-21T11:58:05.454Z", "canceled_at": null, "captured_at": "2026-02-21T11:58:05.436Z", "provider_id": "pp_razorpay_razorpay", "currency_code": "inr", "payment_collection": {"id": "pay_col_01KJ00XTHEGSB1RBX6SA1HK8FT"}, "payment_session_id": "payses_01KJ00XTNSDCBM2E5A0XC7S066", "payment_collection_id": "pay_col_01KJ00XTHEGSB1RBX6SA1HK8FT"}}}}, "payload": {"id": "cart_01KJ00X27TJN0NCJBRFSTM050G"}, "compensate": {}}, "errors": []}	done	2026-02-21 11:58:04.234	2026-02-21 11:58:05.54	\N	259200	01KJ010SE0YKEPG88M4WR3DQF3
\.


--
-- Name: link_module_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.link_module_migrations_id_seq', 19, true);


--
-- Name: mikro_orm_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.mikro_orm_migrations_id_seq', 156, true);


--
-- Name: order_change_action_ordering_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_change_action_ordering_seq', 4, true);


--
-- Name: order_claim_display_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_claim_display_id_seq', 1, false);


--
-- Name: order_display_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_display_id_seq', 3, true);


--
-- Name: order_exchange_display_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_exchange_display_id_seq', 1, false);


--
-- Name: return_display_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.return_display_id_seq', 1, false);


--
-- Name: script_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.script_migrations_id_seq', 2, true);


--
-- Name: account_holder account_holder_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account_holder
    ADD CONSTRAINT account_holder_pkey PRIMARY KEY (id);


--
-- Name: api_key api_key_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.api_key
    ADD CONSTRAINT api_key_pkey PRIMARY KEY (id);


--
-- Name: application_method_buy_rules application_method_buy_rules_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.application_method_buy_rules
    ADD CONSTRAINT application_method_buy_rules_pkey PRIMARY KEY (application_method_id, promotion_rule_id);


--
-- Name: application_method_target_rules application_method_target_rules_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.application_method_target_rules
    ADD CONSTRAINT application_method_target_rules_pkey PRIMARY KEY (application_method_id, promotion_rule_id);


--
-- Name: auth_identity auth_identity_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_identity
    ADD CONSTRAINT auth_identity_pkey PRIMARY KEY (id);


--
-- Name: capture capture_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.capture
    ADD CONSTRAINT capture_pkey PRIMARY KEY (id);


--
-- Name: cart_address cart_address_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_address
    ADD CONSTRAINT cart_address_pkey PRIMARY KEY (id);


--
-- Name: cart_line_item_adjustment cart_line_item_adjustment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_line_item_adjustment
    ADD CONSTRAINT cart_line_item_adjustment_pkey PRIMARY KEY (id);


--
-- Name: cart_line_item cart_line_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_line_item
    ADD CONSTRAINT cart_line_item_pkey PRIMARY KEY (id);


--
-- Name: cart_line_item_tax_line cart_line_item_tax_line_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_line_item_tax_line
    ADD CONSTRAINT cart_line_item_tax_line_pkey PRIMARY KEY (id);


--
-- Name: cart_payment_collection cart_payment_collection_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_payment_collection
    ADD CONSTRAINT cart_payment_collection_pkey PRIMARY KEY (cart_id, payment_collection_id);


--
-- Name: cart cart_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_pkey PRIMARY KEY (id);


--
-- Name: cart_promotion cart_promotion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_promotion
    ADD CONSTRAINT cart_promotion_pkey PRIMARY KEY (cart_id, promotion_id);


--
-- Name: cart_shipping_method_adjustment cart_shipping_method_adjustment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_shipping_method_adjustment
    ADD CONSTRAINT cart_shipping_method_adjustment_pkey PRIMARY KEY (id);


--
-- Name: cart_shipping_method cart_shipping_method_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_shipping_method
    ADD CONSTRAINT cart_shipping_method_pkey PRIMARY KEY (id);


--
-- Name: cart_shipping_method_tax_line cart_shipping_method_tax_line_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_shipping_method_tax_line
    ADD CONSTRAINT cart_shipping_method_tax_line_pkey PRIMARY KEY (id);


--
-- Name: credit_line credit_line_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.credit_line
    ADD CONSTRAINT credit_line_pkey PRIMARY KEY (id);


--
-- Name: currency currency_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.currency
    ADD CONSTRAINT currency_pkey PRIMARY KEY (code);


--
-- Name: customer_account_holder customer_account_holder_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_account_holder
    ADD CONSTRAINT customer_account_holder_pkey PRIMARY KEY (customer_id, account_holder_id);


--
-- Name: customer_address customer_address_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_address
    ADD CONSTRAINT customer_address_pkey PRIMARY KEY (id);


--
-- Name: customer_group_customer customer_group_customer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_group_customer
    ADD CONSTRAINT customer_group_customer_pkey PRIMARY KEY (id);


--
-- Name: customer_group customer_group_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_group
    ADD CONSTRAINT customer_group_pkey PRIMARY KEY (id);


--
-- Name: customer customer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer
    ADD CONSTRAINT customer_pkey PRIMARY KEY (id);


--
-- Name: fulfillment_address fulfillment_address_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fulfillment_address
    ADD CONSTRAINT fulfillment_address_pkey PRIMARY KEY (id);


--
-- Name: fulfillment_item fulfillment_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fulfillment_item
    ADD CONSTRAINT fulfillment_item_pkey PRIMARY KEY (id);


--
-- Name: fulfillment_label fulfillment_label_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fulfillment_label
    ADD CONSTRAINT fulfillment_label_pkey PRIMARY KEY (id);


--
-- Name: fulfillment fulfillment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fulfillment
    ADD CONSTRAINT fulfillment_pkey PRIMARY KEY (id);


--
-- Name: fulfillment_provider fulfillment_provider_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fulfillment_provider
    ADD CONSTRAINT fulfillment_provider_pkey PRIMARY KEY (id);


--
-- Name: fulfillment_set fulfillment_set_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fulfillment_set
    ADD CONSTRAINT fulfillment_set_pkey PRIMARY KEY (id);


--
-- Name: geo_zone geo_zone_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.geo_zone
    ADD CONSTRAINT geo_zone_pkey PRIMARY KEY (id);


--
-- Name: image image_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.image
    ADD CONSTRAINT image_pkey PRIMARY KEY (id);


--
-- Name: inventory_item inventory_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_item
    ADD CONSTRAINT inventory_item_pkey PRIMARY KEY (id);


--
-- Name: inventory_level inventory_level_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_level
    ADD CONSTRAINT inventory_level_pkey PRIMARY KEY (id);


--
-- Name: invite invite_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invite
    ADD CONSTRAINT invite_pkey PRIMARY KEY (id);


--
-- Name: link_module_migrations link_module_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.link_module_migrations
    ADD CONSTRAINT link_module_migrations_pkey PRIMARY KEY (id);


--
-- Name: link_module_migrations link_module_migrations_table_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.link_module_migrations
    ADD CONSTRAINT link_module_migrations_table_name_key UNIQUE (table_name);


--
-- Name: location_fulfillment_provider location_fulfillment_provider_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.location_fulfillment_provider
    ADD CONSTRAINT location_fulfillment_provider_pkey PRIMARY KEY (stock_location_id, fulfillment_provider_id);


--
-- Name: location_fulfillment_set location_fulfillment_set_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.location_fulfillment_set
    ADD CONSTRAINT location_fulfillment_set_pkey PRIMARY KEY (stock_location_id, fulfillment_set_id);


--
-- Name: mikro_orm_migrations mikro_orm_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mikro_orm_migrations
    ADD CONSTRAINT mikro_orm_migrations_pkey PRIMARY KEY (id);


--
-- Name: notification notification_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification_pkey PRIMARY KEY (id);


--
-- Name: notification_provider notification_provider_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification_provider
    ADD CONSTRAINT notification_provider_pkey PRIMARY KEY (id);


--
-- Name: order_address order_address_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_address
    ADD CONSTRAINT order_address_pkey PRIMARY KEY (id);


--
-- Name: order_cart order_cart_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_cart
    ADD CONSTRAINT order_cart_pkey PRIMARY KEY (order_id, cart_id);


--
-- Name: order_change_action order_change_action_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_change_action
    ADD CONSTRAINT order_change_action_pkey PRIMARY KEY (id);


--
-- Name: order_change order_change_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_change
    ADD CONSTRAINT order_change_pkey PRIMARY KEY (id);


--
-- Name: order_claim_item_image order_claim_item_image_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_claim_item_image
    ADD CONSTRAINT order_claim_item_image_pkey PRIMARY KEY (id);


--
-- Name: order_claim_item order_claim_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_claim_item
    ADD CONSTRAINT order_claim_item_pkey PRIMARY KEY (id);


--
-- Name: order_claim order_claim_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_claim
    ADD CONSTRAINT order_claim_pkey PRIMARY KEY (id);


--
-- Name: order_credit_line order_credit_line_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_credit_line
    ADD CONSTRAINT order_credit_line_pkey PRIMARY KEY (id);


--
-- Name: order_exchange_item order_exchange_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_exchange_item
    ADD CONSTRAINT order_exchange_item_pkey PRIMARY KEY (id);


--
-- Name: order_exchange order_exchange_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_exchange
    ADD CONSTRAINT order_exchange_pkey PRIMARY KEY (id);


--
-- Name: order_fulfillment order_fulfillment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_fulfillment
    ADD CONSTRAINT order_fulfillment_pkey PRIMARY KEY (order_id, fulfillment_id);


--
-- Name: order_item order_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_item
    ADD CONSTRAINT order_item_pkey PRIMARY KEY (id);


--
-- Name: order_line_item_adjustment order_line_item_adjustment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_line_item_adjustment
    ADD CONSTRAINT order_line_item_adjustment_pkey PRIMARY KEY (id);


--
-- Name: order_line_item order_line_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_line_item
    ADD CONSTRAINT order_line_item_pkey PRIMARY KEY (id);


--
-- Name: order_line_item_tax_line order_line_item_tax_line_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_line_item_tax_line
    ADD CONSTRAINT order_line_item_tax_line_pkey PRIMARY KEY (id);


--
-- Name: order_payment_collection order_payment_collection_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_payment_collection
    ADD CONSTRAINT order_payment_collection_pkey PRIMARY KEY (order_id, payment_collection_id);


--
-- Name: order order_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT order_pkey PRIMARY KEY (id);


--
-- Name: order_promotion order_promotion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_promotion
    ADD CONSTRAINT order_promotion_pkey PRIMARY KEY (order_id, promotion_id);


--
-- Name: order_shipping_method_adjustment order_shipping_method_adjustment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_shipping_method_adjustment
    ADD CONSTRAINT order_shipping_method_adjustment_pkey PRIMARY KEY (id);


--
-- Name: order_shipping_method order_shipping_method_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_shipping_method
    ADD CONSTRAINT order_shipping_method_pkey PRIMARY KEY (id);


--
-- Name: order_shipping_method_tax_line order_shipping_method_tax_line_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_shipping_method_tax_line
    ADD CONSTRAINT order_shipping_method_tax_line_pkey PRIMARY KEY (id);


--
-- Name: order_shipping order_shipping_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_shipping
    ADD CONSTRAINT order_shipping_pkey PRIMARY KEY (id);


--
-- Name: order_summary order_summary_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_summary
    ADD CONSTRAINT order_summary_pkey PRIMARY KEY (id);


--
-- Name: order_transaction order_transaction_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_transaction
    ADD CONSTRAINT order_transaction_pkey PRIMARY KEY (id);


--
-- Name: payment_collection_payment_providers payment_collection_payment_providers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_collection_payment_providers
    ADD CONSTRAINT payment_collection_payment_providers_pkey PRIMARY KEY (payment_collection_id, payment_provider_id);


--
-- Name: payment_collection payment_collection_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_collection
    ADD CONSTRAINT payment_collection_pkey PRIMARY KEY (id);


--
-- Name: payment payment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT payment_pkey PRIMARY KEY (id);


--
-- Name: payment_provider payment_provider_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_provider
    ADD CONSTRAINT payment_provider_pkey PRIMARY KEY (id);


--
-- Name: payment_session payment_session_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_session
    ADD CONSTRAINT payment_session_pkey PRIMARY KEY (id);


--
-- Name: price_list price_list_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.price_list
    ADD CONSTRAINT price_list_pkey PRIMARY KEY (id);


--
-- Name: price_list_rule price_list_rule_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.price_list_rule
    ADD CONSTRAINT price_list_rule_pkey PRIMARY KEY (id);


--
-- Name: price price_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.price
    ADD CONSTRAINT price_pkey PRIMARY KEY (id);


--
-- Name: price_preference price_preference_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.price_preference
    ADD CONSTRAINT price_preference_pkey PRIMARY KEY (id);


--
-- Name: price_rule price_rule_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.price_rule
    ADD CONSTRAINT price_rule_pkey PRIMARY KEY (id);


--
-- Name: price_set price_set_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.price_set
    ADD CONSTRAINT price_set_pkey PRIMARY KEY (id);


--
-- Name: product_category product_category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_category
    ADD CONSTRAINT product_category_pkey PRIMARY KEY (id);


--
-- Name: product_category_product product_category_product_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_category_product
    ADD CONSTRAINT product_category_product_pkey PRIMARY KEY (product_id, product_category_id);


--
-- Name: product_collection product_collection_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_collection
    ADD CONSTRAINT product_collection_pkey PRIMARY KEY (id);


--
-- Name: product_option product_option_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_option
    ADD CONSTRAINT product_option_pkey PRIMARY KEY (id);


--
-- Name: product_option_value product_option_value_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_option_value
    ADD CONSTRAINT product_option_value_pkey PRIMARY KEY (id);


--
-- Name: product product_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_pkey PRIMARY KEY (id);


--
-- Name: product_sales_channel product_sales_channel_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_sales_channel
    ADD CONSTRAINT product_sales_channel_pkey PRIMARY KEY (product_id, sales_channel_id);


--
-- Name: product_shipping_profile product_shipping_profile_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_shipping_profile
    ADD CONSTRAINT product_shipping_profile_pkey PRIMARY KEY (product_id, shipping_profile_id);


--
-- Name: product_tag product_tag_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_tag
    ADD CONSTRAINT product_tag_pkey PRIMARY KEY (id);


--
-- Name: product_tags product_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_tags
    ADD CONSTRAINT product_tags_pkey PRIMARY KEY (product_id, product_tag_id);


--
-- Name: product_type product_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_type
    ADD CONSTRAINT product_type_pkey PRIMARY KEY (id);


--
-- Name: product_variant_inventory_item product_variant_inventory_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variant_inventory_item
    ADD CONSTRAINT product_variant_inventory_item_pkey PRIMARY KEY (variant_id, inventory_item_id);


--
-- Name: product_variant_option product_variant_option_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variant_option
    ADD CONSTRAINT product_variant_option_pkey PRIMARY KEY (variant_id, option_value_id);


--
-- Name: product_variant product_variant_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variant
    ADD CONSTRAINT product_variant_pkey PRIMARY KEY (id);


--
-- Name: product_variant_price_set product_variant_price_set_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variant_price_set
    ADD CONSTRAINT product_variant_price_set_pkey PRIMARY KEY (variant_id, price_set_id);


--
-- Name: product_variant_product_image product_variant_product_image_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variant_product_image
    ADD CONSTRAINT product_variant_product_image_pkey PRIMARY KEY (id);


--
-- Name: promotion_application_method promotion_application_method_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotion_application_method
    ADD CONSTRAINT promotion_application_method_pkey PRIMARY KEY (id);


--
-- Name: promotion_campaign_budget promotion_campaign_budget_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotion_campaign_budget
    ADD CONSTRAINT promotion_campaign_budget_pkey PRIMARY KEY (id);


--
-- Name: promotion_campaign_budget_usage promotion_campaign_budget_usage_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotion_campaign_budget_usage
    ADD CONSTRAINT promotion_campaign_budget_usage_pkey PRIMARY KEY (id);


--
-- Name: promotion_campaign promotion_campaign_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotion_campaign
    ADD CONSTRAINT promotion_campaign_pkey PRIMARY KEY (id);


--
-- Name: promotion promotion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotion
    ADD CONSTRAINT promotion_pkey PRIMARY KEY (id);


--
-- Name: promotion_promotion_rule promotion_promotion_rule_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotion_promotion_rule
    ADD CONSTRAINT promotion_promotion_rule_pkey PRIMARY KEY (promotion_id, promotion_rule_id);


--
-- Name: promotion_rule promotion_rule_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotion_rule
    ADD CONSTRAINT promotion_rule_pkey PRIMARY KEY (id);


--
-- Name: promotion_rule_value promotion_rule_value_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotion_rule_value
    ADD CONSTRAINT promotion_rule_value_pkey PRIMARY KEY (id);


--
-- Name: provider_identity provider_identity_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.provider_identity
    ADD CONSTRAINT provider_identity_pkey PRIMARY KEY (id);


--
-- Name: publishable_api_key_sales_channel publishable_api_key_sales_channel_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.publishable_api_key_sales_channel
    ADD CONSTRAINT publishable_api_key_sales_channel_pkey PRIMARY KEY (publishable_key_id, sales_channel_id);


--
-- Name: refund refund_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refund
    ADD CONSTRAINT refund_pkey PRIMARY KEY (id);


--
-- Name: refund_reason refund_reason_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refund_reason
    ADD CONSTRAINT refund_reason_pkey PRIMARY KEY (id);


--
-- Name: region_country region_country_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.region_country
    ADD CONSTRAINT region_country_pkey PRIMARY KEY (iso_2);


--
-- Name: region_payment_provider region_payment_provider_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.region_payment_provider
    ADD CONSTRAINT region_payment_provider_pkey PRIMARY KEY (region_id, payment_provider_id);


--
-- Name: region region_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.region
    ADD CONSTRAINT region_pkey PRIMARY KEY (id);


--
-- Name: reservation_item reservation_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservation_item
    ADD CONSTRAINT reservation_item_pkey PRIMARY KEY (id);


--
-- Name: return_fulfillment return_fulfillment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.return_fulfillment
    ADD CONSTRAINT return_fulfillment_pkey PRIMARY KEY (return_id, fulfillment_id);


--
-- Name: return_item return_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.return_item
    ADD CONSTRAINT return_item_pkey PRIMARY KEY (id);


--
-- Name: return return_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.return
    ADD CONSTRAINT return_pkey PRIMARY KEY (id);


--
-- Name: return_reason return_reason_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.return_reason
    ADD CONSTRAINT return_reason_pkey PRIMARY KEY (id);


--
-- Name: sales_channel sales_channel_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_channel
    ADD CONSTRAINT sales_channel_pkey PRIMARY KEY (id);


--
-- Name: sales_channel_stock_location sales_channel_stock_location_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_channel_stock_location
    ADD CONSTRAINT sales_channel_stock_location_pkey PRIMARY KEY (sales_channel_id, stock_location_id);


--
-- Name: script_migrations script_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.script_migrations
    ADD CONSTRAINT script_migrations_pkey PRIMARY KEY (id);


--
-- Name: service_zone service_zone_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_zone
    ADD CONSTRAINT service_zone_pkey PRIMARY KEY (id);


--
-- Name: shipping_option shipping_option_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping_option
    ADD CONSTRAINT shipping_option_pkey PRIMARY KEY (id);


--
-- Name: shipping_option_price_set shipping_option_price_set_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping_option_price_set
    ADD CONSTRAINT shipping_option_price_set_pkey PRIMARY KEY (shipping_option_id, price_set_id);


--
-- Name: shipping_option_rule shipping_option_rule_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping_option_rule
    ADD CONSTRAINT shipping_option_rule_pkey PRIMARY KEY (id);


--
-- Name: shipping_option_type shipping_option_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping_option_type
    ADD CONSTRAINT shipping_option_type_pkey PRIMARY KEY (id);


--
-- Name: shipping_profile shipping_profile_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping_profile
    ADD CONSTRAINT shipping_profile_pkey PRIMARY KEY (id);


--
-- Name: stock_location_address stock_location_address_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_location_address
    ADD CONSTRAINT stock_location_address_pkey PRIMARY KEY (id);


--
-- Name: stock_location stock_location_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_location
    ADD CONSTRAINT stock_location_pkey PRIMARY KEY (id);


--
-- Name: store_currency store_currency_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.store_currency
    ADD CONSTRAINT store_currency_pkey PRIMARY KEY (id);


--
-- Name: store_locale store_locale_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.store_locale
    ADD CONSTRAINT store_locale_pkey PRIMARY KEY (id);


--
-- Name: store store_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.store
    ADD CONSTRAINT store_pkey PRIMARY KEY (id);


--
-- Name: tax_provider tax_provider_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tax_provider
    ADD CONSTRAINT tax_provider_pkey PRIMARY KEY (id);


--
-- Name: tax_rate tax_rate_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tax_rate
    ADD CONSTRAINT tax_rate_pkey PRIMARY KEY (id);


--
-- Name: tax_rate_rule tax_rate_rule_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tax_rate_rule
    ADD CONSTRAINT tax_rate_rule_pkey PRIMARY KEY (id);


--
-- Name: tax_region tax_region_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tax_region
    ADD CONSTRAINT tax_region_pkey PRIMARY KEY (id);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: user_preference user_preference_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_preference
    ADD CONSTRAINT user_preference_pkey PRIMARY KEY (id);


--
-- Name: user_rbac_role user_rbac_role_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_rbac_role
    ADD CONSTRAINT user_rbac_role_pkey PRIMARY KEY (user_id, rbac_role_id);


--
-- Name: view_configuration view_configuration_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.view_configuration
    ADD CONSTRAINT view_configuration_pkey PRIMARY KEY (id);


--
-- Name: workflow_execution workflow_execution_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workflow_execution
    ADD CONSTRAINT workflow_execution_pkey PRIMARY KEY (workflow_id, transaction_id, run_id);


--
-- Name: IDX_account_holder_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_account_holder_deleted_at" ON public.account_holder USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_account_holder_id_5cb3a0c0; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_account_holder_id_5cb3a0c0" ON public.customer_account_holder USING btree (account_holder_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_account_holder_provider_id_external_id_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_account_holder_provider_id_external_id_unique" ON public.account_holder USING btree (provider_id, external_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_api_key_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_api_key_deleted_at" ON public.api_key USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_api_key_redacted; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_api_key_redacted" ON public.api_key USING btree (redacted) WHERE (deleted_at IS NULL);


--
-- Name: IDX_api_key_revoked_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_api_key_revoked_at" ON public.api_key USING btree (revoked_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_api_key_token_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_api_key_token_unique" ON public.api_key USING btree (token);


--
-- Name: IDX_api_key_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_api_key_type" ON public.api_key USING btree (type);


--
-- Name: IDX_application_method_allocation; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_application_method_allocation" ON public.promotion_application_method USING btree (allocation);


--
-- Name: IDX_application_method_target_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_application_method_target_type" ON public.promotion_application_method USING btree (target_type);


--
-- Name: IDX_application_method_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_application_method_type" ON public.promotion_application_method USING btree (type);


--
-- Name: IDX_auth_identity_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_auth_identity_deleted_at" ON public.auth_identity USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_campaign_budget_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_campaign_budget_type" ON public.promotion_campaign_budget USING btree (type);


--
-- Name: IDX_capture_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_capture_deleted_at" ON public.capture USING btree (deleted_at);


--
-- Name: IDX_capture_payment_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_capture_payment_id" ON public.capture USING btree (payment_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_cart_address_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_address_deleted_at" ON public.cart_address USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_cart_billing_address_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_billing_address_id" ON public.cart USING btree (billing_address_id) WHERE ((deleted_at IS NULL) AND (billing_address_id IS NOT NULL));


--
-- Name: IDX_cart_credit_line_reference_reference_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_credit_line_reference_reference_id" ON public.credit_line USING btree (reference, reference_id) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_cart_currency_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_currency_code" ON public.cart USING btree (currency_code);


--
-- Name: IDX_cart_customer_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_customer_id" ON public.cart USING btree (customer_id) WHERE ((deleted_at IS NULL) AND (customer_id IS NOT NULL));


--
-- Name: IDX_cart_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_deleted_at" ON public.cart USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_cart_id_-4a39f6c9; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_id_-4a39f6c9" ON public.cart_payment_collection USING btree (cart_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_cart_id_-71069c16; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_id_-71069c16" ON public.order_cart USING btree (cart_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_cart_id_-a9d4a70b; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_id_-a9d4a70b" ON public.cart_promotion USING btree (cart_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_cart_line_item_adjustment_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_line_item_adjustment_deleted_at" ON public.cart_line_item_adjustment USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_cart_line_item_adjustment_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_line_item_adjustment_item_id" ON public.cart_line_item_adjustment USING btree (item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_cart_line_item_cart_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_line_item_cart_id" ON public.cart_line_item USING btree (cart_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_cart_line_item_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_line_item_deleted_at" ON public.cart_line_item USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_cart_line_item_tax_line_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_line_item_tax_line_deleted_at" ON public.cart_line_item_tax_line USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_cart_line_item_tax_line_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_line_item_tax_line_item_id" ON public.cart_line_item_tax_line USING btree (item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_cart_region_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_region_id" ON public.cart USING btree (region_id) WHERE ((deleted_at IS NULL) AND (region_id IS NOT NULL));


--
-- Name: IDX_cart_sales_channel_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_sales_channel_id" ON public.cart USING btree (sales_channel_id) WHERE ((deleted_at IS NULL) AND (sales_channel_id IS NOT NULL));


--
-- Name: IDX_cart_shipping_address_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_shipping_address_id" ON public.cart USING btree (shipping_address_id) WHERE ((deleted_at IS NULL) AND (shipping_address_id IS NOT NULL));


--
-- Name: IDX_cart_shipping_method_adjustment_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_shipping_method_adjustment_deleted_at" ON public.cart_shipping_method_adjustment USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_cart_shipping_method_adjustment_shipping_method_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_shipping_method_adjustment_shipping_method_id" ON public.cart_shipping_method_adjustment USING btree (shipping_method_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_cart_shipping_method_cart_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_shipping_method_cart_id" ON public.cart_shipping_method USING btree (cart_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_cart_shipping_method_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_shipping_method_deleted_at" ON public.cart_shipping_method USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_cart_shipping_method_tax_line_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_shipping_method_tax_line_deleted_at" ON public.cart_shipping_method_tax_line USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_cart_shipping_method_tax_line_shipping_method_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_cart_shipping_method_tax_line_shipping_method_id" ON public.cart_shipping_method_tax_line USING btree (shipping_method_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_category_handle_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_category_handle_unique" ON public.product_category USING btree (handle) WHERE (deleted_at IS NULL);


--
-- Name: IDX_collection_handle_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_collection_handle_unique" ON public.product_collection USING btree (handle) WHERE (deleted_at IS NULL);


--
-- Name: IDX_credit_line_cart_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_credit_line_cart_id" ON public.credit_line USING btree (cart_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_credit_line_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_credit_line_deleted_at" ON public.credit_line USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_customer_address_customer_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_customer_address_customer_id" ON public.customer_address USING btree (customer_id);


--
-- Name: IDX_customer_address_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_customer_address_deleted_at" ON public.customer_address USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_customer_address_unique_customer_billing; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_customer_address_unique_customer_billing" ON public.customer_address USING btree (customer_id) WHERE (is_default_billing = true);


--
-- Name: IDX_customer_address_unique_customer_shipping; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_customer_address_unique_customer_shipping" ON public.customer_address USING btree (customer_id) WHERE (is_default_shipping = true);


--
-- Name: IDX_customer_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_customer_deleted_at" ON public.customer USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_customer_email_has_account_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_customer_email_has_account_unique" ON public.customer USING btree (email, has_account) WHERE (deleted_at IS NULL);


--
-- Name: IDX_customer_group_customer_customer_group_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_customer_group_customer_customer_group_id" ON public.customer_group_customer USING btree (customer_group_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_customer_group_customer_customer_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_customer_group_customer_customer_id" ON public.customer_group_customer USING btree (customer_id);


--
-- Name: IDX_customer_group_customer_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_customer_group_customer_deleted_at" ON public.customer_group_customer USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_customer_group_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_customer_group_deleted_at" ON public.customer_group USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_customer_group_name_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_customer_group_name_unique" ON public.customer_group USING btree (name) WHERE (deleted_at IS NULL);


--
-- Name: IDX_customer_id_5cb3a0c0; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_customer_id_5cb3a0c0" ON public.customer_account_holder USING btree (customer_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_deleted_at_-1d67bae40; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_-1d67bae40" ON public.publishable_api_key_sales_channel USING btree (deleted_at);


--
-- Name: IDX_deleted_at_-1e5992737; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_-1e5992737" ON public.location_fulfillment_provider USING btree (deleted_at);


--
-- Name: IDX_deleted_at_-31ea43a; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_-31ea43a" ON public.return_fulfillment USING btree (deleted_at);


--
-- Name: IDX_deleted_at_-4a39f6c9; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_-4a39f6c9" ON public.cart_payment_collection USING btree (deleted_at);


--
-- Name: IDX_deleted_at_-71069c16; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_-71069c16" ON public.order_cart USING btree (deleted_at);


--
-- Name: IDX_deleted_at_-71518339; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_-71518339" ON public.order_promotion USING btree (deleted_at);


--
-- Name: IDX_deleted_at_-a9d4a70b; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_-a9d4a70b" ON public.cart_promotion USING btree (deleted_at);


--
-- Name: IDX_deleted_at_-e88adb96; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_-e88adb96" ON public.location_fulfillment_set USING btree (deleted_at);


--
-- Name: IDX_deleted_at_-e8d2543e; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_-e8d2543e" ON public.order_fulfillment USING btree (deleted_at);


--
-- Name: IDX_deleted_at_17a262437; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_17a262437" ON public.product_shipping_profile USING btree (deleted_at);


--
-- Name: IDX_deleted_at_17b4c4e35; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_17b4c4e35" ON public.product_variant_inventory_item USING btree (deleted_at);


--
-- Name: IDX_deleted_at_1c934dab0; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_1c934dab0" ON public.region_payment_provider USING btree (deleted_at);


--
-- Name: IDX_deleted_at_20b454295; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_20b454295" ON public.product_sales_channel USING btree (deleted_at);


--
-- Name: IDX_deleted_at_26d06f470; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_26d06f470" ON public.sales_channel_stock_location USING btree (deleted_at);


--
-- Name: IDX_deleted_at_52b23597; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_52b23597" ON public.product_variant_price_set USING btree (deleted_at);


--
-- Name: IDX_deleted_at_5cb3a0c0; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_5cb3a0c0" ON public.customer_account_holder USING btree (deleted_at);


--
-- Name: IDX_deleted_at_64ff0c4c; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_64ff0c4c" ON public.user_rbac_role USING btree (deleted_at);


--
-- Name: IDX_deleted_at_ba32fa9c; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_ba32fa9c" ON public.shipping_option_price_set USING btree (deleted_at);


--
-- Name: IDX_deleted_at_f42b9949; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_deleted_at_f42b9949" ON public.order_payment_collection USING btree (deleted_at);


--
-- Name: IDX_fulfillment_address_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_fulfillment_address_deleted_at" ON public.fulfillment_address USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_fulfillment_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_fulfillment_deleted_at" ON public.fulfillment USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_fulfillment_id_-31ea43a; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_fulfillment_id_-31ea43a" ON public.return_fulfillment USING btree (fulfillment_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_fulfillment_id_-e8d2543e; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_fulfillment_id_-e8d2543e" ON public.order_fulfillment USING btree (fulfillment_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_fulfillment_item_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_fulfillment_item_deleted_at" ON public.fulfillment_item USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_fulfillment_item_fulfillment_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_fulfillment_item_fulfillment_id" ON public.fulfillment_item USING btree (fulfillment_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_fulfillment_item_inventory_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_fulfillment_item_inventory_item_id" ON public.fulfillment_item USING btree (inventory_item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_fulfillment_item_line_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_fulfillment_item_line_item_id" ON public.fulfillment_item USING btree (line_item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_fulfillment_label_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_fulfillment_label_deleted_at" ON public.fulfillment_label USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_fulfillment_label_fulfillment_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_fulfillment_label_fulfillment_id" ON public.fulfillment_label USING btree (fulfillment_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_fulfillment_location_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_fulfillment_location_id" ON public.fulfillment USING btree (location_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_fulfillment_provider_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_fulfillment_provider_deleted_at" ON public.fulfillment_provider USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_fulfillment_provider_id_-1e5992737; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_fulfillment_provider_id_-1e5992737" ON public.location_fulfillment_provider USING btree (fulfillment_provider_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_fulfillment_set_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_fulfillment_set_deleted_at" ON public.fulfillment_set USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_fulfillment_set_id_-e88adb96; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_fulfillment_set_id_-e88adb96" ON public.location_fulfillment_set USING btree (fulfillment_set_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_fulfillment_set_name_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_fulfillment_set_name_unique" ON public.fulfillment_set USING btree (name) WHERE (deleted_at IS NULL);


--
-- Name: IDX_fulfillment_shipping_option_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_fulfillment_shipping_option_id" ON public.fulfillment USING btree (shipping_option_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_geo_zone_city; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_geo_zone_city" ON public.geo_zone USING btree (city) WHERE ((deleted_at IS NULL) AND (city IS NOT NULL));


--
-- Name: IDX_geo_zone_country_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_geo_zone_country_code" ON public.geo_zone USING btree (country_code) WHERE (deleted_at IS NULL);


--
-- Name: IDX_geo_zone_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_geo_zone_deleted_at" ON public.geo_zone USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_geo_zone_province_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_geo_zone_province_code" ON public.geo_zone USING btree (province_code) WHERE ((deleted_at IS NULL) AND (province_code IS NOT NULL));


--
-- Name: IDX_geo_zone_service_zone_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_geo_zone_service_zone_id" ON public.geo_zone USING btree (service_zone_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_id_-1d67bae40; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_-1d67bae40" ON public.publishable_api_key_sales_channel USING btree (id);


--
-- Name: IDX_id_-1e5992737; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_-1e5992737" ON public.location_fulfillment_provider USING btree (id);


--
-- Name: IDX_id_-31ea43a; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_-31ea43a" ON public.return_fulfillment USING btree (id);


--
-- Name: IDX_id_-4a39f6c9; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_-4a39f6c9" ON public.cart_payment_collection USING btree (id);


--
-- Name: IDX_id_-71069c16; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_-71069c16" ON public.order_cart USING btree (id);


--
-- Name: IDX_id_-71518339; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_-71518339" ON public.order_promotion USING btree (id);


--
-- Name: IDX_id_-a9d4a70b; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_-a9d4a70b" ON public.cart_promotion USING btree (id);


--
-- Name: IDX_id_-e88adb96; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_-e88adb96" ON public.location_fulfillment_set USING btree (id);


--
-- Name: IDX_id_-e8d2543e; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_-e8d2543e" ON public.order_fulfillment USING btree (id);


--
-- Name: IDX_id_17a262437; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_17a262437" ON public.product_shipping_profile USING btree (id);


--
-- Name: IDX_id_17b4c4e35; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_17b4c4e35" ON public.product_variant_inventory_item USING btree (id);


--
-- Name: IDX_id_1c934dab0; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_1c934dab0" ON public.region_payment_provider USING btree (id);


--
-- Name: IDX_id_20b454295; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_20b454295" ON public.product_sales_channel USING btree (id);


--
-- Name: IDX_id_26d06f470; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_26d06f470" ON public.sales_channel_stock_location USING btree (id);


--
-- Name: IDX_id_52b23597; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_52b23597" ON public.product_variant_price_set USING btree (id);


--
-- Name: IDX_id_5cb3a0c0; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_5cb3a0c0" ON public.customer_account_holder USING btree (id);


--
-- Name: IDX_id_64ff0c4c; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_64ff0c4c" ON public.user_rbac_role USING btree (id);


--
-- Name: IDX_id_ba32fa9c; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_ba32fa9c" ON public.shipping_option_price_set USING btree (id);


--
-- Name: IDX_id_f42b9949; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_id_f42b9949" ON public.order_payment_collection USING btree (id);


--
-- Name: IDX_image_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_image_deleted_at" ON public.image USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_image_product_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_image_product_id" ON public.image USING btree (product_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_inventory_item_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_inventory_item_deleted_at" ON public.inventory_item USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_inventory_item_id_17b4c4e35; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_inventory_item_id_17b4c4e35" ON public.product_variant_inventory_item USING btree (inventory_item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_inventory_item_sku; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_inventory_item_sku" ON public.inventory_item USING btree (sku) WHERE (deleted_at IS NULL);


--
-- Name: IDX_inventory_level_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_inventory_level_deleted_at" ON public.inventory_level USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_inventory_level_inventory_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_inventory_level_inventory_item_id" ON public.inventory_level USING btree (inventory_item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_inventory_level_location_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_inventory_level_location_id" ON public.inventory_level USING btree (location_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_inventory_level_location_id_inventory_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_inventory_level_location_id_inventory_item_id" ON public.inventory_level USING btree (inventory_item_id, location_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_invite_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_invite_deleted_at" ON public.invite USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_invite_email_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_invite_email_unique" ON public.invite USING btree (email) WHERE (deleted_at IS NULL);


--
-- Name: IDX_invite_token; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_invite_token" ON public.invite USING btree (token) WHERE (deleted_at IS NULL);


--
-- Name: IDX_line_item_adjustment_promotion_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_line_item_adjustment_promotion_id" ON public.cart_line_item_adjustment USING btree (promotion_id) WHERE ((deleted_at IS NULL) AND (promotion_id IS NOT NULL));


--
-- Name: IDX_line_item_product_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_line_item_product_id" ON public.cart_line_item USING btree (product_id) WHERE ((deleted_at IS NULL) AND (product_id IS NOT NULL));


--
-- Name: IDX_line_item_product_type_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_line_item_product_type_id" ON public.order_line_item USING btree (product_type_id) WHERE ((deleted_at IS NULL) AND (product_type_id IS NOT NULL));


--
-- Name: IDX_line_item_tax_line_tax_rate_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_line_item_tax_line_tax_rate_id" ON public.cart_line_item_tax_line USING btree (tax_rate_id) WHERE ((deleted_at IS NULL) AND (tax_rate_id IS NOT NULL));


--
-- Name: IDX_line_item_variant_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_line_item_variant_id" ON public.cart_line_item USING btree (variant_id) WHERE ((deleted_at IS NULL) AND (variant_id IS NOT NULL));


--
-- Name: IDX_notification_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_notification_deleted_at" ON public.notification USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_notification_idempotency_key_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_notification_idempotency_key_unique" ON public.notification USING btree (idempotency_key) WHERE (deleted_at IS NULL);


--
-- Name: IDX_notification_provider_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_notification_provider_deleted_at" ON public.notification_provider USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_notification_provider_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_notification_provider_id" ON public.notification USING btree (provider_id);


--
-- Name: IDX_notification_receiver_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_notification_receiver_id" ON public.notification USING btree (receiver_id);


--
-- Name: IDX_option_product_id_title_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_option_product_id_title_unique" ON public.product_option USING btree (product_id, title) WHERE (deleted_at IS NULL);


--
-- Name: IDX_option_value_option_id_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_option_value_option_id_unique" ON public.product_option_value USING btree (option_id, value) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_address_customer_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_address_customer_id" ON public.order_address USING btree (customer_id);


--
-- Name: IDX_order_address_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_address_deleted_at" ON public.order_address USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_billing_address_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_billing_address_id" ON public."order" USING btree (billing_address_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_change_action_claim_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_change_action_claim_id" ON public.order_change_action USING btree (claim_id) WHERE ((claim_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_order_change_action_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_change_action_deleted_at" ON public.order_change_action USING btree (deleted_at);


--
-- Name: IDX_order_change_action_exchange_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_change_action_exchange_id" ON public.order_change_action USING btree (exchange_id) WHERE ((exchange_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_order_change_action_order_change_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_change_action_order_change_id" ON public.order_change_action USING btree (order_change_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_change_action_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_change_action_order_id" ON public.order_change_action USING btree (order_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_change_action_ordering; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_change_action_ordering" ON public.order_change_action USING btree (ordering) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_change_action_return_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_change_action_return_id" ON public.order_change_action USING btree (return_id) WHERE ((return_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_order_change_change_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_change_change_type" ON public.order_change USING btree (change_type);


--
-- Name: IDX_order_change_claim_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_change_claim_id" ON public.order_change USING btree (claim_id) WHERE ((claim_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_order_change_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_change_deleted_at" ON public.order_change USING btree (deleted_at);


--
-- Name: IDX_order_change_exchange_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_change_exchange_id" ON public.order_change USING btree (exchange_id) WHERE ((exchange_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_order_change_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_change_order_id" ON public.order_change USING btree (order_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_change_order_id_version; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_change_order_id_version" ON public.order_change USING btree (order_id, version);


--
-- Name: IDX_order_change_return_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_change_return_id" ON public.order_change USING btree (return_id) WHERE ((return_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_order_change_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_change_status" ON public.order_change USING btree (status) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_change_version; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_change_version" ON public.order_change USING btree (order_id, version) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_claim_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_claim_deleted_at" ON public.order_claim USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_claim_display_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_claim_display_id" ON public.order_claim USING btree (display_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_claim_item_claim_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_claim_item_claim_id" ON public.order_claim_item USING btree (claim_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_claim_item_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_claim_item_deleted_at" ON public.order_claim_item USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_claim_item_image_claim_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_claim_item_image_claim_item_id" ON public.order_claim_item_image USING btree (claim_item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_claim_item_image_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_claim_item_image_deleted_at" ON public.order_claim_item_image USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_order_claim_item_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_claim_item_item_id" ON public.order_claim_item USING btree (item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_claim_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_claim_order_id" ON public.order_claim USING btree (order_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_claim_return_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_claim_return_id" ON public.order_claim USING btree (return_id) WHERE ((return_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_order_credit_line_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_credit_line_deleted_at" ON public.order_credit_line USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_order_credit_line_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_credit_line_order_id" ON public.order_credit_line USING btree (order_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_credit_line_order_id_version; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_credit_line_order_id_version" ON public.order_credit_line USING btree (order_id, version) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_currency_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_currency_code" ON public."order" USING btree (currency_code) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_custom_display_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_order_custom_display_id" ON public."order" USING btree (custom_display_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_customer_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_customer_id" ON public."order" USING btree (customer_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_deleted_at" ON public."order" USING btree (deleted_at);


--
-- Name: IDX_order_display_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_display_id" ON public."order" USING btree (display_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_exchange_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_exchange_deleted_at" ON public.order_exchange USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_exchange_display_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_exchange_display_id" ON public.order_exchange USING btree (display_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_exchange_item_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_exchange_item_deleted_at" ON public.order_exchange_item USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_exchange_item_exchange_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_exchange_item_exchange_id" ON public.order_exchange_item USING btree (exchange_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_exchange_item_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_exchange_item_item_id" ON public.order_exchange_item USING btree (item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_exchange_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_exchange_order_id" ON public.order_exchange USING btree (order_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_exchange_return_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_exchange_return_id" ON public.order_exchange USING btree (return_id) WHERE ((return_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_order_id_-71069c16; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_id_-71069c16" ON public.order_cart USING btree (order_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_id_-71518339; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_id_-71518339" ON public.order_promotion USING btree (order_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_id_-e8d2543e; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_id_-e8d2543e" ON public.order_fulfillment USING btree (order_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_id_f42b9949; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_id_f42b9949" ON public.order_payment_collection USING btree (order_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_is_draft_order; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_is_draft_order" ON public."order" USING btree (is_draft_order) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_item_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_item_deleted_at" ON public.order_item USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_order_item_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_item_item_id" ON public.order_item USING btree (item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_item_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_item_order_id" ON public.order_item USING btree (order_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_item_order_id_version; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_item_order_id_version" ON public.order_item USING btree (order_id, version) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_line_item_adjustment_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_line_item_adjustment_item_id" ON public.order_line_item_adjustment USING btree (item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_line_item_product_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_line_item_product_id" ON public.order_line_item USING btree (product_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_line_item_tax_line_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_line_item_tax_line_item_id" ON public.order_line_item_tax_line USING btree (item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_line_item_variant_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_line_item_variant_id" ON public.order_line_item USING btree (variant_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_region_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_region_id" ON public."order" USING btree (region_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_sales_channel_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_sales_channel_id" ON public."order" USING btree (sales_channel_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_shipping_address_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_shipping_address_id" ON public."order" USING btree (shipping_address_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_shipping_claim_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_shipping_claim_id" ON public.order_shipping USING btree (claim_id) WHERE ((claim_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_order_shipping_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_shipping_deleted_at" ON public.order_shipping USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_order_shipping_exchange_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_shipping_exchange_id" ON public.order_shipping USING btree (exchange_id) WHERE ((exchange_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_order_shipping_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_shipping_item_id" ON public.order_shipping USING btree (shipping_method_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_shipping_method_adjustment_shipping_method_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_shipping_method_adjustment_shipping_method_id" ON public.order_shipping_method_adjustment USING btree (shipping_method_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_shipping_method_shipping_option_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_shipping_method_shipping_option_id" ON public.order_shipping_method USING btree (shipping_option_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_shipping_method_tax_line_shipping_method_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_shipping_method_tax_line_shipping_method_id" ON public.order_shipping_method_tax_line USING btree (shipping_method_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_shipping_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_shipping_order_id" ON public.order_shipping USING btree (order_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_shipping_order_id_version; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_shipping_order_id_version" ON public.order_shipping USING btree (order_id, version) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_shipping_return_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_shipping_return_id" ON public.order_shipping USING btree (return_id) WHERE ((return_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_order_shipping_shipping_method_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_shipping_shipping_method_id" ON public.order_shipping USING btree (shipping_method_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_summary_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_summary_deleted_at" ON public.order_summary USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_order_summary_order_id_version; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_summary_order_id_version" ON public.order_summary USING btree (order_id, version) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_transaction_claim_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_transaction_claim_id" ON public.order_transaction USING btree (claim_id) WHERE ((claim_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_order_transaction_currency_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_transaction_currency_code" ON public.order_transaction USING btree (currency_code) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_transaction_exchange_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_transaction_exchange_id" ON public.order_transaction USING btree (exchange_id) WHERE ((exchange_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_order_transaction_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_transaction_order_id" ON public.order_transaction USING btree (order_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_transaction_order_id_version; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_transaction_order_id_version" ON public.order_transaction USING btree (order_id, version) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_transaction_reference_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_transaction_reference_id" ON public.order_transaction USING btree (reference_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_order_transaction_return_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_order_transaction_return_id" ON public.order_transaction USING btree (return_id) WHERE ((return_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_payment_collection_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_payment_collection_deleted_at" ON public.payment_collection USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_payment_collection_id_-4a39f6c9; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_payment_collection_id_-4a39f6c9" ON public.cart_payment_collection USING btree (payment_collection_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_payment_collection_id_f42b9949; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_payment_collection_id_f42b9949" ON public.order_payment_collection USING btree (payment_collection_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_payment_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_payment_deleted_at" ON public.payment USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_payment_payment_collection_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_payment_payment_collection_id" ON public.payment USING btree (payment_collection_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_payment_payment_session_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_payment_payment_session_id" ON public.payment USING btree (payment_session_id);


--
-- Name: IDX_payment_payment_session_id_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_payment_payment_session_id_unique" ON public.payment USING btree (payment_session_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_payment_provider_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_payment_provider_deleted_at" ON public.payment_provider USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_payment_provider_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_payment_provider_id" ON public.payment USING btree (provider_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_payment_provider_id_1c934dab0; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_payment_provider_id_1c934dab0" ON public.region_payment_provider USING btree (payment_provider_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_payment_session_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_payment_session_deleted_at" ON public.payment_session USING btree (deleted_at);


--
-- Name: IDX_payment_session_payment_collection_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_payment_session_payment_collection_id" ON public.payment_session USING btree (payment_collection_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_price_currency_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_currency_code" ON public.price USING btree (currency_code) WHERE (deleted_at IS NULL);


--
-- Name: IDX_price_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_deleted_at" ON public.price USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_price_list_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_list_deleted_at" ON public.price_list USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_price_list_id_status_starts_at_ends_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_list_id_status_starts_at_ends_at" ON public.price_list USING btree (id, status, starts_at, ends_at) WHERE ((deleted_at IS NULL) AND (status = 'active'::text));


--
-- Name: IDX_price_list_rule_attribute; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_list_rule_attribute" ON public.price_list_rule USING btree (attribute) WHERE (deleted_at IS NULL);


--
-- Name: IDX_price_list_rule_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_list_rule_deleted_at" ON public.price_list_rule USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_price_list_rule_price_list_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_list_rule_price_list_id" ON public.price_list_rule USING btree (price_list_id) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_price_list_rule_value; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_list_rule_value" ON public.price_list_rule USING gin (value) WHERE (deleted_at IS NULL);


--
-- Name: IDX_price_preference_attribute_value; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_price_preference_attribute_value" ON public.price_preference USING btree (attribute, value) WHERE (deleted_at IS NULL);


--
-- Name: IDX_price_preference_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_preference_deleted_at" ON public.price_preference USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_price_price_list_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_price_list_id" ON public.price USING btree (price_list_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_price_price_set_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_price_set_id" ON public.price USING btree (price_set_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_price_rule_attribute; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_rule_attribute" ON public.price_rule USING btree (attribute) WHERE (deleted_at IS NULL);


--
-- Name: IDX_price_rule_attribute_value; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_rule_attribute_value" ON public.price_rule USING btree (attribute, value) WHERE (deleted_at IS NULL);


--
-- Name: IDX_price_rule_attribute_value_price_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_rule_attribute_value_price_id" ON public.price_rule USING btree (attribute, value, price_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_price_rule_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_rule_deleted_at" ON public.price_rule USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_price_rule_operator; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_rule_operator" ON public.price_rule USING btree (operator);


--
-- Name: IDX_price_rule_operator_value; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_rule_operator_value" ON public.price_rule USING btree (operator, value) WHERE (deleted_at IS NULL);


--
-- Name: IDX_price_rule_price_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_rule_price_id" ON public.price_rule USING btree (price_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_price_rule_price_id_attribute_operator_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_price_rule_price_id_attribute_operator_unique" ON public.price_rule USING btree (price_id, attribute, operator) WHERE (deleted_at IS NULL);


--
-- Name: IDX_price_set_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_set_deleted_at" ON public.price_set USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_price_set_id_52b23597; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_set_id_52b23597" ON public.product_variant_price_set USING btree (price_set_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_price_set_id_ba32fa9c; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_price_set_id_ba32fa9c" ON public.shipping_option_price_set USING btree (price_set_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_category_parent_category_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_category_parent_category_id" ON public.product_category USING btree (parent_category_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_category_path; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_category_path" ON public.product_category USING btree (mpath) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_collection_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_collection_deleted_at" ON public.product_collection USING btree (deleted_at);


--
-- Name: IDX_product_collection_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_collection_id" ON public.product USING btree (collection_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_deleted_at" ON public.product USING btree (deleted_at);


--
-- Name: IDX_product_handle_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_product_handle_unique" ON public.product USING btree (handle) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_id_17a262437; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_id_17a262437" ON public.product_shipping_profile USING btree (product_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_id_20b454295; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_id_20b454295" ON public.product_sales_channel USING btree (product_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_image_rank; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_image_rank" ON public.image USING btree (rank) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_image_rank_product_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_image_rank_product_id" ON public.image USING btree (rank, product_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_image_url; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_image_url" ON public.image USING btree (url) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_image_url_rank_product_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_image_url_rank_product_id" ON public.image USING btree (url, rank, product_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_option_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_option_deleted_at" ON public.product_option USING btree (deleted_at);


--
-- Name: IDX_product_option_product_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_option_product_id" ON public.product_option USING btree (product_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_option_value_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_option_value_deleted_at" ON public.product_option_value USING btree (deleted_at);


--
-- Name: IDX_product_option_value_option_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_option_value_option_id" ON public.product_option_value USING btree (option_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_status" ON public.product USING btree (status) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_tag_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_tag_deleted_at" ON public.product_tag USING btree (deleted_at);


--
-- Name: IDX_product_type_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_type_deleted_at" ON public.product_type USING btree (deleted_at);


--
-- Name: IDX_product_type_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_type_id" ON public.product USING btree (type_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_variant_barcode_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_product_variant_barcode_unique" ON public.product_variant USING btree (barcode) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_variant_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_variant_deleted_at" ON public.product_variant USING btree (deleted_at);


--
-- Name: IDX_product_variant_ean_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_product_variant_ean_unique" ON public.product_variant USING btree (ean) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_variant_id_product_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_variant_id_product_id" ON public.product_variant USING btree (id, product_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_variant_product_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_variant_product_id" ON public.product_variant USING btree (product_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_variant_product_image_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_variant_product_image_deleted_at" ON public.product_variant_product_image USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_variant_product_image_image_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_variant_product_image_image_id" ON public.product_variant_product_image USING btree (image_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_variant_product_image_variant_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_product_variant_product_image_variant_id" ON public.product_variant_product_image USING btree (variant_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_variant_sku_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_product_variant_sku_unique" ON public.product_variant USING btree (sku) WHERE (deleted_at IS NULL);


--
-- Name: IDX_product_variant_upc_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_product_variant_upc_unique" ON public.product_variant USING btree (upc) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_application_method_currency_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_application_method_currency_code" ON public.promotion_application_method USING btree (currency_code) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_promotion_application_method_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_application_method_deleted_at" ON public.promotion_application_method USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_application_method_promotion_id_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_promotion_application_method_promotion_id_unique" ON public.promotion_application_method USING btree (promotion_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_campaign_budget_campaign_id_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_promotion_campaign_budget_campaign_id_unique" ON public.promotion_campaign_budget USING btree (campaign_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_campaign_budget_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_campaign_budget_deleted_at" ON public.promotion_campaign_budget USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_campaign_budget_usage_attribute_value_budget_id_u; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_promotion_campaign_budget_usage_attribute_value_budget_id_u" ON public.promotion_campaign_budget_usage USING btree (attribute_value, budget_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_campaign_budget_usage_budget_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_campaign_budget_usage_budget_id" ON public.promotion_campaign_budget_usage USING btree (budget_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_campaign_budget_usage_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_campaign_budget_usage_deleted_at" ON public.promotion_campaign_budget_usage USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_campaign_campaign_identifier_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_promotion_campaign_campaign_identifier_unique" ON public.promotion_campaign USING btree (campaign_identifier) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_campaign_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_campaign_deleted_at" ON public.promotion_campaign USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_campaign_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_campaign_id" ON public.promotion USING btree (campaign_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_deleted_at" ON public.promotion USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_id_-71518339; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_id_-71518339" ON public.order_promotion USING btree (promotion_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_id_-a9d4a70b; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_id_-a9d4a70b" ON public.cart_promotion USING btree (promotion_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_is_automatic; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_is_automatic" ON public.promotion USING btree (is_automatic) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_rule_attribute; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_rule_attribute" ON public.promotion_rule USING btree (attribute);


--
-- Name: IDX_promotion_rule_attribute_operator; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_rule_attribute_operator" ON public.promotion_rule USING btree (attribute, operator) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_rule_attribute_operator_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_rule_attribute_operator_id" ON public.promotion_rule USING btree (operator, attribute, id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_rule_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_rule_deleted_at" ON public.promotion_rule USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_rule_operator; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_rule_operator" ON public.promotion_rule USING btree (operator);


--
-- Name: IDX_promotion_rule_value_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_rule_value_deleted_at" ON public.promotion_rule_value USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_rule_value_promotion_rule_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_rule_value_promotion_rule_id" ON public.promotion_rule_value USING btree (promotion_rule_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_rule_value_rule_id_value; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_rule_value_rule_id_value" ON public.promotion_rule_value USING btree (promotion_rule_id, value) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_rule_value_value; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_rule_value_value" ON public.promotion_rule_value USING btree (value) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_status" ON public.promotion USING btree (status) WHERE (deleted_at IS NULL);


--
-- Name: IDX_promotion_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_promotion_type" ON public.promotion USING btree (type);


--
-- Name: IDX_provider_identity_auth_identity_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_provider_identity_auth_identity_id" ON public.provider_identity USING btree (auth_identity_id);


--
-- Name: IDX_provider_identity_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_provider_identity_deleted_at" ON public.provider_identity USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_provider_identity_provider_entity_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_provider_identity_provider_entity_id" ON public.provider_identity USING btree (entity_id, provider);


--
-- Name: IDX_publishable_key_id_-1d67bae40; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_publishable_key_id_-1d67bae40" ON public.publishable_api_key_sales_channel USING btree (publishable_key_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_rbac_role_id_64ff0c4c; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_rbac_role_id_64ff0c4c" ON public.user_rbac_role USING btree (rbac_role_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_refund_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_refund_deleted_at" ON public.refund USING btree (deleted_at);


--
-- Name: IDX_refund_payment_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_refund_payment_id" ON public.refund USING btree (payment_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_refund_reason_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_refund_reason_deleted_at" ON public.refund_reason USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_refund_refund_reason_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_refund_refund_reason_id" ON public.refund USING btree (refund_reason_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_region_country_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_region_country_deleted_at" ON public.region_country USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_region_country_region_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_region_country_region_id" ON public.region_country USING btree (region_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_region_country_region_id_iso_2_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_region_country_region_id_iso_2_unique" ON public.region_country USING btree (region_id, iso_2);


--
-- Name: IDX_region_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_region_deleted_at" ON public.region USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_region_id_1c934dab0; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_region_id_1c934dab0" ON public.region_payment_provider USING btree (region_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_reservation_item_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_reservation_item_deleted_at" ON public.reservation_item USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_reservation_item_inventory_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_reservation_item_inventory_item_id" ON public.reservation_item USING btree (inventory_item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_reservation_item_line_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_reservation_item_line_item_id" ON public.reservation_item USING btree (line_item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_reservation_item_location_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_reservation_item_location_id" ON public.reservation_item USING btree (location_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_return_claim_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_return_claim_id" ON public.return USING btree (claim_id) WHERE ((claim_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_return_display_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_return_display_id" ON public.return USING btree (display_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_return_exchange_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_return_exchange_id" ON public.return USING btree (exchange_id) WHERE ((exchange_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_return_id_-31ea43a; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_return_id_-31ea43a" ON public.return_fulfillment USING btree (return_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_return_item_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_return_item_deleted_at" ON public.return_item USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_return_item_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_return_item_item_id" ON public.return_item USING btree (item_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_return_item_reason_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_return_item_reason_id" ON public.return_item USING btree (reason_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_return_item_return_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_return_item_return_id" ON public.return_item USING btree (return_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_return_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_return_order_id" ON public.return USING btree (order_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_return_reason_parent_return_reason_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_return_reason_parent_return_reason_id" ON public.return_reason USING btree (parent_return_reason_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_return_reason_value; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_return_reason_value" ON public.return_reason USING btree (value) WHERE (deleted_at IS NULL);


--
-- Name: IDX_sales_channel_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_sales_channel_deleted_at" ON public.sales_channel USING btree (deleted_at);


--
-- Name: IDX_sales_channel_id_-1d67bae40; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_sales_channel_id_-1d67bae40" ON public.publishable_api_key_sales_channel USING btree (sales_channel_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_sales_channel_id_20b454295; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_sales_channel_id_20b454295" ON public.product_sales_channel USING btree (sales_channel_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_sales_channel_id_26d06f470; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_sales_channel_id_26d06f470" ON public.sales_channel_stock_location USING btree (sales_channel_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_service_zone_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_service_zone_deleted_at" ON public.service_zone USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_service_zone_fulfillment_set_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_service_zone_fulfillment_set_id" ON public.service_zone USING btree (fulfillment_set_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_service_zone_name_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_service_zone_name_unique" ON public.service_zone USING btree (name) WHERE (deleted_at IS NULL);


--
-- Name: IDX_shipping_method_adjustment_promotion_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_shipping_method_adjustment_promotion_id" ON public.cart_shipping_method_adjustment USING btree (promotion_id) WHERE ((deleted_at IS NULL) AND (promotion_id IS NOT NULL));


--
-- Name: IDX_shipping_method_option_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_shipping_method_option_id" ON public.cart_shipping_method USING btree (shipping_option_id) WHERE ((deleted_at IS NULL) AND (shipping_option_id IS NOT NULL));


--
-- Name: IDX_shipping_method_tax_line_tax_rate_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_shipping_method_tax_line_tax_rate_id" ON public.cart_shipping_method_tax_line USING btree (tax_rate_id) WHERE ((deleted_at IS NULL) AND (tax_rate_id IS NOT NULL));


--
-- Name: IDX_shipping_option_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_shipping_option_deleted_at" ON public.shipping_option USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_shipping_option_id_ba32fa9c; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_shipping_option_id_ba32fa9c" ON public.shipping_option_price_set USING btree (shipping_option_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_shipping_option_provider_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_shipping_option_provider_id" ON public.shipping_option USING btree (provider_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_shipping_option_rule_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_shipping_option_rule_deleted_at" ON public.shipping_option_rule USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_shipping_option_rule_shipping_option_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_shipping_option_rule_shipping_option_id" ON public.shipping_option_rule USING btree (shipping_option_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_shipping_option_service_zone_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_shipping_option_service_zone_id" ON public.shipping_option USING btree (service_zone_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_shipping_option_shipping_option_type_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_shipping_option_shipping_option_type_id" ON public.shipping_option USING btree (shipping_option_type_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_shipping_option_shipping_profile_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_shipping_option_shipping_profile_id" ON public.shipping_option USING btree (shipping_profile_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_shipping_option_type_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_shipping_option_type_deleted_at" ON public.shipping_option_type USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_shipping_profile_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_shipping_profile_deleted_at" ON public.shipping_profile USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_shipping_profile_id_17a262437; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_shipping_profile_id_17a262437" ON public.product_shipping_profile USING btree (shipping_profile_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_shipping_profile_name_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_shipping_profile_name_unique" ON public.shipping_profile USING btree (name) WHERE (deleted_at IS NULL);


--
-- Name: IDX_single_default_region; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_single_default_region" ON public.tax_rate USING btree (tax_region_id) WHERE ((is_default = true) AND (deleted_at IS NULL));


--
-- Name: IDX_stock_location_address_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_stock_location_address_deleted_at" ON public.stock_location_address USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_stock_location_address_id_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_stock_location_address_id_unique" ON public.stock_location USING btree (address_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_stock_location_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_stock_location_deleted_at" ON public.stock_location USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_stock_location_id_-1e5992737; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_stock_location_id_-1e5992737" ON public.location_fulfillment_provider USING btree (stock_location_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_stock_location_id_-e88adb96; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_stock_location_id_-e88adb96" ON public.location_fulfillment_set USING btree (stock_location_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_stock_location_id_26d06f470; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_stock_location_id_26d06f470" ON public.sales_channel_stock_location USING btree (stock_location_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_store_currency_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_store_currency_deleted_at" ON public.store_currency USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_store_currency_store_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_store_currency_store_id" ON public.store_currency USING btree (store_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_store_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_store_deleted_at" ON public.store USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_store_locale_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_store_locale_deleted_at" ON public.store_locale USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_store_locale_store_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_store_locale_store_id" ON public.store_locale USING btree (store_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_tag_value_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_tag_value_unique" ON public.product_tag USING btree (value) WHERE (deleted_at IS NULL);


--
-- Name: IDX_tax_provider_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_tax_provider_deleted_at" ON public.tax_provider USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_tax_rate_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_tax_rate_deleted_at" ON public.tax_rate USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_tax_rate_rule_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_tax_rate_rule_deleted_at" ON public.tax_rate_rule USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_tax_rate_rule_reference_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_tax_rate_rule_reference_id" ON public.tax_rate_rule USING btree (reference_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_tax_rate_rule_tax_rate_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_tax_rate_rule_tax_rate_id" ON public.tax_rate_rule USING btree (tax_rate_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_tax_rate_rule_unique_rate_reference; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_tax_rate_rule_unique_rate_reference" ON public.tax_rate_rule USING btree (tax_rate_id, reference_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_tax_rate_tax_region_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_tax_rate_tax_region_id" ON public.tax_rate USING btree (tax_region_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_tax_region_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_tax_region_deleted_at" ON public.tax_region USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_tax_region_parent_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_tax_region_parent_id" ON public.tax_region USING btree (parent_id);


--
-- Name: IDX_tax_region_provider_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_tax_region_provider_id" ON public.tax_region USING btree (provider_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_tax_region_unique_country_nullable_province; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_tax_region_unique_country_nullable_province" ON public.tax_region USING btree (country_code) WHERE ((province_code IS NULL) AND (deleted_at IS NULL));


--
-- Name: IDX_tax_region_unique_country_province; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_tax_region_unique_country_province" ON public.tax_region USING btree (country_code, province_code) WHERE (deleted_at IS NULL);


--
-- Name: IDX_type_value_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_type_value_unique" ON public.product_type USING btree (value) WHERE (deleted_at IS NULL);


--
-- Name: IDX_unique_promotion_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_unique_promotion_code" ON public.promotion USING btree (code) WHERE (deleted_at IS NULL);


--
-- Name: IDX_user_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_user_deleted_at" ON public."user" USING btree (deleted_at) WHERE (deleted_at IS NOT NULL);


--
-- Name: IDX_user_email_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_user_email_unique" ON public."user" USING btree (email) WHERE (deleted_at IS NULL);


--
-- Name: IDX_user_id_64ff0c4c; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_user_id_64ff0c4c" ON public.user_rbac_role USING btree (user_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_user_preference_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_user_preference_deleted_at" ON public.user_preference USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_user_preference_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_user_preference_user_id" ON public.user_preference USING btree (user_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_user_preference_user_id_key_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_user_preference_user_id_key_unique" ON public.user_preference USING btree (user_id, key) WHERE (deleted_at IS NULL);


--
-- Name: IDX_variant_id_17b4c4e35; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_variant_id_17b4c4e35" ON public.product_variant_inventory_item USING btree (variant_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_variant_id_52b23597; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_variant_id_52b23597" ON public.product_variant_price_set USING btree (variant_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_view_configuration_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_view_configuration_deleted_at" ON public.view_configuration USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_view_configuration_entity_is_system_default; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_view_configuration_entity_is_system_default" ON public.view_configuration USING btree (entity, is_system_default) WHERE (deleted_at IS NULL);


--
-- Name: IDX_view_configuration_entity_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_view_configuration_entity_user_id" ON public.view_configuration USING btree (entity, user_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_view_configuration_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_view_configuration_user_id" ON public.view_configuration USING btree (user_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_workflow_execution_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_workflow_execution_deleted_at" ON public.workflow_execution USING btree (deleted_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_workflow_execution_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_workflow_execution_id" ON public.workflow_execution USING btree (id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_workflow_execution_retention_time_updated_at_state; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_workflow_execution_retention_time_updated_at_state" ON public.workflow_execution USING btree (retention_time, updated_at, state) WHERE ((deleted_at IS NULL) AND (retention_time IS NOT NULL));


--
-- Name: IDX_workflow_execution_run_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_workflow_execution_run_id" ON public.workflow_execution USING btree (run_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_workflow_execution_state; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_workflow_execution_state" ON public.workflow_execution USING btree (state) WHERE (deleted_at IS NULL);


--
-- Name: IDX_workflow_execution_state_updated_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_workflow_execution_state_updated_at" ON public.workflow_execution USING btree (state, updated_at) WHERE (deleted_at IS NULL);


--
-- Name: IDX_workflow_execution_transaction_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_workflow_execution_transaction_id" ON public.workflow_execution USING btree (transaction_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_workflow_execution_updated_at_retention_time; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_workflow_execution_updated_at_retention_time" ON public.workflow_execution USING btree (updated_at, retention_time) WHERE ((deleted_at IS NULL) AND (retention_time IS NOT NULL) AND ((state)::text = ANY ((ARRAY['done'::character varying, 'failed'::character varying, 'reverted'::character varying])::text[])));


--
-- Name: IDX_workflow_execution_workflow_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_workflow_execution_workflow_id" ON public.workflow_execution USING btree (workflow_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_workflow_execution_workflow_id_transaction_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_workflow_execution_workflow_id_transaction_id" ON public.workflow_execution USING btree (workflow_id, transaction_id) WHERE (deleted_at IS NULL);


--
-- Name: IDX_workflow_execution_workflow_id_transaction_id_run_id_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "IDX_workflow_execution_workflow_id_transaction_id_run_id_unique" ON public.workflow_execution USING btree (workflow_id, transaction_id, run_id) WHERE (deleted_at IS NULL);


--
-- Name: idx_script_name_unique; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_script_name_unique ON public.script_migrations USING btree (script_name);


--
-- Name: tax_rate_rule FK_tax_rate_rule_tax_rate_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tax_rate_rule
    ADD CONSTRAINT "FK_tax_rate_rule_tax_rate_id" FOREIGN KEY (tax_rate_id) REFERENCES public.tax_rate(id) ON DELETE CASCADE;


--
-- Name: tax_rate FK_tax_rate_tax_region_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tax_rate
    ADD CONSTRAINT "FK_tax_rate_tax_region_id" FOREIGN KEY (tax_region_id) REFERENCES public.tax_region(id) ON DELETE CASCADE;


--
-- Name: tax_region FK_tax_region_parent_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tax_region
    ADD CONSTRAINT "FK_tax_region_parent_id" FOREIGN KEY (parent_id) REFERENCES public.tax_region(id) ON DELETE CASCADE;


--
-- Name: tax_region FK_tax_region_provider_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tax_region
    ADD CONSTRAINT "FK_tax_region_provider_id" FOREIGN KEY (provider_id) REFERENCES public.tax_provider(id) ON DELETE SET NULL;


--
-- Name: application_method_buy_rules application_method_buy_rules_application_method_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.application_method_buy_rules
    ADD CONSTRAINT application_method_buy_rules_application_method_id_foreign FOREIGN KEY (application_method_id) REFERENCES public.promotion_application_method(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: application_method_buy_rules application_method_buy_rules_promotion_rule_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.application_method_buy_rules
    ADD CONSTRAINT application_method_buy_rules_promotion_rule_id_foreign FOREIGN KEY (promotion_rule_id) REFERENCES public.promotion_rule(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: application_method_target_rules application_method_target_rules_application_method_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.application_method_target_rules
    ADD CONSTRAINT application_method_target_rules_application_method_id_foreign FOREIGN KEY (application_method_id) REFERENCES public.promotion_application_method(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: application_method_target_rules application_method_target_rules_promotion_rule_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.application_method_target_rules
    ADD CONSTRAINT application_method_target_rules_promotion_rule_id_foreign FOREIGN KEY (promotion_rule_id) REFERENCES public.promotion_rule(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: capture capture_payment_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.capture
    ADD CONSTRAINT capture_payment_id_foreign FOREIGN KEY (payment_id) REFERENCES public.payment(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: cart cart_billing_address_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_billing_address_id_foreign FOREIGN KEY (billing_address_id) REFERENCES public.cart_address(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: cart_line_item_adjustment cart_line_item_adjustment_item_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_line_item_adjustment
    ADD CONSTRAINT cart_line_item_adjustment_item_id_foreign FOREIGN KEY (item_id) REFERENCES public.cart_line_item(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: cart_line_item cart_line_item_cart_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_line_item
    ADD CONSTRAINT cart_line_item_cart_id_foreign FOREIGN KEY (cart_id) REFERENCES public.cart(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: cart_line_item_tax_line cart_line_item_tax_line_item_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_line_item_tax_line
    ADD CONSTRAINT cart_line_item_tax_line_item_id_foreign FOREIGN KEY (item_id) REFERENCES public.cart_line_item(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: cart cart_shipping_address_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_shipping_address_id_foreign FOREIGN KEY (shipping_address_id) REFERENCES public.cart_address(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: cart_shipping_method_adjustment cart_shipping_method_adjustment_shipping_method_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_shipping_method_adjustment
    ADD CONSTRAINT cart_shipping_method_adjustment_shipping_method_id_foreign FOREIGN KEY (shipping_method_id) REFERENCES public.cart_shipping_method(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: cart_shipping_method cart_shipping_method_cart_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_shipping_method
    ADD CONSTRAINT cart_shipping_method_cart_id_foreign FOREIGN KEY (cart_id) REFERENCES public.cart(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: cart_shipping_method_tax_line cart_shipping_method_tax_line_shipping_method_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_shipping_method_tax_line
    ADD CONSTRAINT cart_shipping_method_tax_line_shipping_method_id_foreign FOREIGN KEY (shipping_method_id) REFERENCES public.cart_shipping_method(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: credit_line credit_line_cart_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.credit_line
    ADD CONSTRAINT credit_line_cart_id_foreign FOREIGN KEY (cart_id) REFERENCES public.cart(id) ON UPDATE CASCADE;


--
-- Name: customer_address customer_address_customer_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_address
    ADD CONSTRAINT customer_address_customer_id_foreign FOREIGN KEY (customer_id) REFERENCES public.customer(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: customer_group_customer customer_group_customer_customer_group_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_group_customer
    ADD CONSTRAINT customer_group_customer_customer_group_id_foreign FOREIGN KEY (customer_group_id) REFERENCES public.customer_group(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: customer_group_customer customer_group_customer_customer_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_group_customer
    ADD CONSTRAINT customer_group_customer_customer_id_foreign FOREIGN KEY (customer_id) REFERENCES public.customer(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: fulfillment fulfillment_delivery_address_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fulfillment
    ADD CONSTRAINT fulfillment_delivery_address_id_foreign FOREIGN KEY (delivery_address_id) REFERENCES public.fulfillment_address(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: fulfillment_item fulfillment_item_fulfillment_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fulfillment_item
    ADD CONSTRAINT fulfillment_item_fulfillment_id_foreign FOREIGN KEY (fulfillment_id) REFERENCES public.fulfillment(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: fulfillment_label fulfillment_label_fulfillment_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fulfillment_label
    ADD CONSTRAINT fulfillment_label_fulfillment_id_foreign FOREIGN KEY (fulfillment_id) REFERENCES public.fulfillment(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: fulfillment fulfillment_provider_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fulfillment
    ADD CONSTRAINT fulfillment_provider_id_foreign FOREIGN KEY (provider_id) REFERENCES public.fulfillment_provider(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: fulfillment fulfillment_shipping_option_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fulfillment
    ADD CONSTRAINT fulfillment_shipping_option_id_foreign FOREIGN KEY (shipping_option_id) REFERENCES public.shipping_option(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: geo_zone geo_zone_service_zone_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.geo_zone
    ADD CONSTRAINT geo_zone_service_zone_id_foreign FOREIGN KEY (service_zone_id) REFERENCES public.service_zone(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: image image_product_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.image
    ADD CONSTRAINT image_product_id_foreign FOREIGN KEY (product_id) REFERENCES public.product(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: inventory_level inventory_level_inventory_item_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_level
    ADD CONSTRAINT inventory_level_inventory_item_id_foreign FOREIGN KEY (inventory_item_id) REFERENCES public.inventory_item(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: notification notification_provider_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification_provider_id_foreign FOREIGN KEY (provider_id) REFERENCES public.notification_provider(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: order order_billing_address_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT order_billing_address_id_foreign FOREIGN KEY (billing_address_id) REFERENCES public.order_address(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: order_change_action order_change_action_order_change_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_change_action
    ADD CONSTRAINT order_change_action_order_change_id_foreign FOREIGN KEY (order_change_id) REFERENCES public.order_change(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_change order_change_order_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_change
    ADD CONSTRAINT order_change_order_id_foreign FOREIGN KEY (order_id) REFERENCES public."order"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_credit_line order_credit_line_order_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_credit_line
    ADD CONSTRAINT order_credit_line_order_id_foreign FOREIGN KEY (order_id) REFERENCES public."order"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_item order_item_item_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_item
    ADD CONSTRAINT order_item_item_id_foreign FOREIGN KEY (item_id) REFERENCES public.order_line_item(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_item order_item_order_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_item
    ADD CONSTRAINT order_item_order_id_foreign FOREIGN KEY (order_id) REFERENCES public."order"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_line_item_adjustment order_line_item_adjustment_item_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_line_item_adjustment
    ADD CONSTRAINT order_line_item_adjustment_item_id_foreign FOREIGN KEY (item_id) REFERENCES public.order_line_item(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_line_item_tax_line order_line_item_tax_line_item_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_line_item_tax_line
    ADD CONSTRAINT order_line_item_tax_line_item_id_foreign FOREIGN KEY (item_id) REFERENCES public.order_line_item(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_line_item order_line_item_totals_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_line_item
    ADD CONSTRAINT order_line_item_totals_id_foreign FOREIGN KEY (totals_id) REFERENCES public.order_item(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order order_shipping_address_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT order_shipping_address_id_foreign FOREIGN KEY (shipping_address_id) REFERENCES public.order_address(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: order_shipping_method_adjustment order_shipping_method_adjustment_shipping_method_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_shipping_method_adjustment
    ADD CONSTRAINT order_shipping_method_adjustment_shipping_method_id_foreign FOREIGN KEY (shipping_method_id) REFERENCES public.order_shipping_method(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_shipping_method_tax_line order_shipping_method_tax_line_shipping_method_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_shipping_method_tax_line
    ADD CONSTRAINT order_shipping_method_tax_line_shipping_method_id_foreign FOREIGN KEY (shipping_method_id) REFERENCES public.order_shipping_method(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_shipping order_shipping_order_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_shipping
    ADD CONSTRAINT order_shipping_order_id_foreign FOREIGN KEY (order_id) REFERENCES public."order"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_summary order_summary_order_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_summary
    ADD CONSTRAINT order_summary_order_id_foreign FOREIGN KEY (order_id) REFERENCES public."order"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_transaction order_transaction_order_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_transaction
    ADD CONSTRAINT order_transaction_order_id_foreign FOREIGN KEY (order_id) REFERENCES public."order"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: payment_collection_payment_providers payment_collection_payment_providers_payment_col_aa276_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_collection_payment_providers
    ADD CONSTRAINT payment_collection_payment_providers_payment_col_aa276_foreign FOREIGN KEY (payment_collection_id) REFERENCES public.payment_collection(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: payment_collection_payment_providers payment_collection_payment_providers_payment_pro_2d555_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_collection_payment_providers
    ADD CONSTRAINT payment_collection_payment_providers_payment_pro_2d555_foreign FOREIGN KEY (payment_provider_id) REFERENCES public.payment_provider(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: payment payment_payment_collection_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT payment_payment_collection_id_foreign FOREIGN KEY (payment_collection_id) REFERENCES public.payment_collection(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: payment_session payment_session_payment_collection_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_session
    ADD CONSTRAINT payment_session_payment_collection_id_foreign FOREIGN KEY (payment_collection_id) REFERENCES public.payment_collection(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: price_list_rule price_list_rule_price_list_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.price_list_rule
    ADD CONSTRAINT price_list_rule_price_list_id_foreign FOREIGN KEY (price_list_id) REFERENCES public.price_list(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: price price_price_list_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.price
    ADD CONSTRAINT price_price_list_id_foreign FOREIGN KEY (price_list_id) REFERENCES public.price_list(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: price price_price_set_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.price
    ADD CONSTRAINT price_price_set_id_foreign FOREIGN KEY (price_set_id) REFERENCES public.price_set(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: price_rule price_rule_price_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.price_rule
    ADD CONSTRAINT price_rule_price_id_foreign FOREIGN KEY (price_id) REFERENCES public.price(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_category product_category_parent_category_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_category
    ADD CONSTRAINT product_category_parent_category_id_foreign FOREIGN KEY (parent_category_id) REFERENCES public.product_category(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_category_product product_category_product_product_category_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_category_product
    ADD CONSTRAINT product_category_product_product_category_id_foreign FOREIGN KEY (product_category_id) REFERENCES public.product_category(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_category_product product_category_product_product_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_category_product
    ADD CONSTRAINT product_category_product_product_id_foreign FOREIGN KEY (product_id) REFERENCES public.product(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product product_collection_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_collection_id_foreign FOREIGN KEY (collection_id) REFERENCES public.product_collection(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: product_option product_option_product_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_option
    ADD CONSTRAINT product_option_product_id_foreign FOREIGN KEY (product_id) REFERENCES public.product(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_option_value product_option_value_option_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_option_value
    ADD CONSTRAINT product_option_value_option_id_foreign FOREIGN KEY (option_id) REFERENCES public.product_option(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_tags product_tags_product_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_tags
    ADD CONSTRAINT product_tags_product_id_foreign FOREIGN KEY (product_id) REFERENCES public.product(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_tags product_tags_product_tag_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_tags
    ADD CONSTRAINT product_tags_product_tag_id_foreign FOREIGN KEY (product_tag_id) REFERENCES public.product_tag(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product product_type_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_type_id_foreign FOREIGN KEY (type_id) REFERENCES public.product_type(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: product_variant_option product_variant_option_option_value_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variant_option
    ADD CONSTRAINT product_variant_option_option_value_id_foreign FOREIGN KEY (option_value_id) REFERENCES public.product_option_value(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_variant_option product_variant_option_variant_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variant_option
    ADD CONSTRAINT product_variant_option_variant_id_foreign FOREIGN KEY (variant_id) REFERENCES public.product_variant(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_variant product_variant_product_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variant
    ADD CONSTRAINT product_variant_product_id_foreign FOREIGN KEY (product_id) REFERENCES public.product(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_variant_product_image product_variant_product_image_image_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variant_product_image
    ADD CONSTRAINT product_variant_product_image_image_id_foreign FOREIGN KEY (image_id) REFERENCES public.image(id) ON DELETE CASCADE;


--
-- Name: promotion_application_method promotion_application_method_promotion_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotion_application_method
    ADD CONSTRAINT promotion_application_method_promotion_id_foreign FOREIGN KEY (promotion_id) REFERENCES public.promotion(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: promotion_campaign_budget promotion_campaign_budget_campaign_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotion_campaign_budget
    ADD CONSTRAINT promotion_campaign_budget_campaign_id_foreign FOREIGN KEY (campaign_id) REFERENCES public.promotion_campaign(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: promotion_campaign_budget_usage promotion_campaign_budget_usage_budget_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotion_campaign_budget_usage
    ADD CONSTRAINT promotion_campaign_budget_usage_budget_id_foreign FOREIGN KEY (budget_id) REFERENCES public.promotion_campaign_budget(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: promotion promotion_campaign_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotion
    ADD CONSTRAINT promotion_campaign_id_foreign FOREIGN KEY (campaign_id) REFERENCES public.promotion_campaign(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: promotion_promotion_rule promotion_promotion_rule_promotion_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotion_promotion_rule
    ADD CONSTRAINT promotion_promotion_rule_promotion_id_foreign FOREIGN KEY (promotion_id) REFERENCES public.promotion(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: promotion_promotion_rule promotion_promotion_rule_promotion_rule_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotion_promotion_rule
    ADD CONSTRAINT promotion_promotion_rule_promotion_rule_id_foreign FOREIGN KEY (promotion_rule_id) REFERENCES public.promotion_rule(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: promotion_rule_value promotion_rule_value_promotion_rule_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotion_rule_value
    ADD CONSTRAINT promotion_rule_value_promotion_rule_id_foreign FOREIGN KEY (promotion_rule_id) REFERENCES public.promotion_rule(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: provider_identity provider_identity_auth_identity_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.provider_identity
    ADD CONSTRAINT provider_identity_auth_identity_id_foreign FOREIGN KEY (auth_identity_id) REFERENCES public.auth_identity(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: refund refund_payment_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refund
    ADD CONSTRAINT refund_payment_id_foreign FOREIGN KEY (payment_id) REFERENCES public.payment(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: region_country region_country_region_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.region_country
    ADD CONSTRAINT region_country_region_id_foreign FOREIGN KEY (region_id) REFERENCES public.region(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: reservation_item reservation_item_inventory_item_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservation_item
    ADD CONSTRAINT reservation_item_inventory_item_id_foreign FOREIGN KEY (inventory_item_id) REFERENCES public.inventory_item(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: return_reason return_reason_parent_return_reason_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.return_reason
    ADD CONSTRAINT return_reason_parent_return_reason_id_foreign FOREIGN KEY (parent_return_reason_id) REFERENCES public.return_reason(id);


--
-- Name: service_zone service_zone_fulfillment_set_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_zone
    ADD CONSTRAINT service_zone_fulfillment_set_id_foreign FOREIGN KEY (fulfillment_set_id) REFERENCES public.fulfillment_set(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: shipping_option shipping_option_provider_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping_option
    ADD CONSTRAINT shipping_option_provider_id_foreign FOREIGN KEY (provider_id) REFERENCES public.fulfillment_provider(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: shipping_option_rule shipping_option_rule_shipping_option_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping_option_rule
    ADD CONSTRAINT shipping_option_rule_shipping_option_id_foreign FOREIGN KEY (shipping_option_id) REFERENCES public.shipping_option(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: shipping_option shipping_option_service_zone_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping_option
    ADD CONSTRAINT shipping_option_service_zone_id_foreign FOREIGN KEY (service_zone_id) REFERENCES public.service_zone(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: shipping_option shipping_option_shipping_option_type_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping_option
    ADD CONSTRAINT shipping_option_shipping_option_type_id_foreign FOREIGN KEY (shipping_option_type_id) REFERENCES public.shipping_option_type(id) ON UPDATE CASCADE;


--
-- Name: shipping_option shipping_option_shipping_profile_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping_option
    ADD CONSTRAINT shipping_option_shipping_profile_id_foreign FOREIGN KEY (shipping_profile_id) REFERENCES public.shipping_profile(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: stock_location stock_location_address_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_location
    ADD CONSTRAINT stock_location_address_id_foreign FOREIGN KEY (address_id) REFERENCES public.stock_location_address(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: store_currency store_currency_store_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.store_currency
    ADD CONSTRAINT store_currency_store_id_foreign FOREIGN KEY (store_id) REFERENCES public.store(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: store_locale store_locale_store_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.store_locale
    ADD CONSTRAINT store_locale_store_id_foreign FOREIGN KEY (store_id) REFERENCES public.store(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict egq1a9YDs4PBapL47FhN5AcgatdvCTzVpDcdz7A44gLf7QsjNeUb6JycBMfOCxK

