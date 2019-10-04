"Vim configuration file -- Marius Cramer (marcramer@protonmail.com)

"Vim-Plug configutaions
call plug#begin('~/vim/plugged')

Plug 'lervag/vimtex'
    let g:tex_flavor='latex'
    let g:vimtex_view_method='zathura'
    let g:vimtex_quickfix_mode=0
    set conceallevel=0
    let g:tex_conceal='abdmg'
Plug 'sirver/ultisnips'
    let g:UltiSnipsExpandTrigger = '<tab>'
    let g:UltiSnipsJumpForwardTrigger = '<tab>'
    let g:UltiSnipsJumpBackwardTrigger = '<s-tab>'
Plug 'scrooloose/nerdtree'
Plug 'vim-airline/vim-airline'
Plug 'vim-airline/vim-airline-themes'
    let g:airline_theme='deus'
Plug 'arcticicestudio/nord-vim'
Plug 'vim-scripts/vim-auto-save'
	let g:auto_save = 1  " enable AutoSave on Vim startup
	let g:auto_save_no_updatetime = 1  " do not change the 'updatetime' option
	let g:auto_save_in_insert_mode = 0  " do not save while in insert mode
Plug 'junegunn/goyo.vim'
	let g:goyo_width = 105
    let g:goyo_height = 40
Plug 'junegunn/limelight.vim'
Plug 'airblade/vim-gitgutter'
Plug 'iamcco/markdown-preview.nvim', { 'do': { -> mkdp#util#install() } }
	let g:mkdp_browser = 'firefox'
	let g:mkdp_preview_options = {
    \ 'disable_sync_scroll': 0,
    \ 'sync_scroll_type': 'relative',
    \ }
call plug#end()

"Editor settings
set laststatus=2
set tabstop=4
set nu
set showmatch
set termguicolors
set noshowmode
set tw=90
set smartcase
set hlsearch
set cursorline
set foldmethod=manual
set foldnestmax=10
set foldlevel=2
colorscheme nord
augroup remember_folds
    autocmd!
    autocmd BufWinLeave ?* mkview | filetype detect
    autocmd BufWinEnter ?* silent loadview | filetype detect
augroup END

"Goyo configs
function! s:goyo_enter()
	set nu
	set noshowmode
	set noshowcmd
	Limelight
endfunction

function! s:goyo_leave()
	set nu
	Limelight!
endfunction

autocmd! User GoyoEnter nested call <SID>goyo_enter()
autocmd! User GoyoLeave nested call <SID>goyo_leave()

"Mappings
noremap <C-n> :NERDTreeToggle<CR>
noremap <C-y> :tabn<CR>
noremap <C-o> :Goyo<CR>
noremap <C-t> :UndotreeToggle<CR>
inoremap <C-l> <c-g>u<Esc>[s1z=`]a<c-g>u
inoremap <C-f> <Esc>: silent exec '.!inkscape-figures create "'.getline('.').'" "'.b:vimtex.root.'/figures/"'<CR><CR>:w<CR>
nnoremap <C-f> : silent exec '!inkscape-figures edit "'.b:vimtex.root.'/figures/" > /dev/null 2>&1 &'<CR><CR>:redraw!<CR>
nnoremap <C-p> <Plug>MarkdownPreviewToggle
